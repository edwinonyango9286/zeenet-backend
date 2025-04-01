const Enquiry = require("../models/enquiryModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const redis = require("../utils/redis");
const ejs = require("ejs");
const path = require("path");
const sendEmail = require("./emailCtrl");

// enquiries can be so many so there is need to chache them.
const createAnEnquiry = expressAsyncHandler(async (req, res) => {
  try {
    const { sentBy, email, phoneNumber, enquiryBody } = req.body;
    if (!sentBy || !email || !phoneNumber || !enquiryBody) {
      throw new Error("Please provide all the required fields.");
    }
    const createdEnquiry = await Enquiry.create(req.body);

    // send email to user if enquiry is created.
    if (createdEnquiry) {
      // invalidate cached enquiries if the new enquiry is created successfully
      const cacheKeyPattern = `enquiries:*`;
      const keys = await redis.keys(cacheKeyPattern);
      keys.forEach((key) => {
        redis.del(key);
      });

      // send a cinformation email to user confirming that the enquiry is and will be responded to
      const enquiryData = {
        createdEnquiry: { sentBy, enquiryBody },
      };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mail-templates/enquiryResponse.ejs"),
        enquiryData
      );
      const data = {
        to: createdEnquiry?.email,
        subject: "Confirmation of your inquiry",
        text: "Zeent e-commerce",
        html: html,
      };
      await sendEmail(data);
    }
    // set the created enquiry in cache for 1 hour
    const cacheKey = `enquiry:${createdEnquiry?._id}`;
    await redis.set(cacheKey, JSON.stringify(createdEnquiry), "EX", 3600);
    return res.status(201).json({
      status: "SUCCESS",
      message: "Enquiry created successfully.",
      data: createdEnquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateAnEnquiryStatus = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const { status } = req.body;
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status: status },
      {
        new: true,
      }
    );
    // if updated enquiry invalidate all enquiries and the single inquiry
    if (updatedEnquiry) {
      const cacheKeyPattern = `enquiries:*`;
      const keys = await redis.keys(cacheKeyPattern);
      keys.forEach((key) => {
        redis.del(key);
      });
      // invalidate the single enquiry
      const cacheKey = `enquiry${updatedEnquiry?._id}`;
      await redis.del(cacheKey);
    }
    if (!updatedEnquiry) {
      throw new Error("Enquiry not found.");
    }
    // set the updated enquiry in the redis
    const cacheKey = `enquiry${updatedEnquiry?._id}`;
    await redis.set(cacheKey, JSON.stringify(updatedEnquiry));
    return res.status(200).json({
      status: "SUCCESS",
      message: "Equiry updated successfully",
      data: updatedEnquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteAnEnquiry = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);

    const deletedEnquiry = await Enquiry.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      {
        new: true,
      }
    );
    if (!deletedEnquiry) {
      throw new Error("Enquiry not found.");
    }
    // invalidate all enqueries in cache
    const cacheKeyPattern = `enquiries:*`;
    const keys = await redis.keys(cacheKeyPattern);
    keys.forEach((key) => {
      redis.del(key);
    });
    // invalidate the deleted enquiry in cache
    const cacheKey = `enquiry:${deletedEnquiry?._id}`;
    await redis.del(cacheKey);
    return res.status(200).json({
      status: "SUCCESS",
      message: "Enquiry deleted successfully.",
      data: deletedEnquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAnEnquiry = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    // Get enquiry from cached data
    const cacheKey = `enquiry:${id}`;
    const cachedEnquiry = await redis.get(cacheKey);

    if (cachedEnquiry) {
      return res
        .status(200)
        .json({ status: "SUCCESS", data: JSON.parse(cachedEnquiry) });
    }
    // get  enquiry from database
    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      throw new Error("Enquiry not found.");
    }
    await redis.set(cacheKey, JSON.stringify(enquiry), "EX", 84600);
    return res.status(200).json({ status: "SUCCESS", data: enquiry });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllEquiries = expressAsyncHandler(async (req, res) => {
  try {
    const queryObject = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "offset", "fields"];
    excludeFields.forEach((el) => delete queryObject[el]);

    // Get only enquiries that have not been deleted
    queryObject.isDeleted = true; // Change this to check for deletedStatus

    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Enquiry.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Pagination
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;
    query = query.skip(offset).limit(limit);

    // Caching enquiries
    const cacheKey = `enquiries:${JSON.stringify(queryObject)}:${
      req.query.sort
    }:${req.query.fields}:${limit}:${offset}`;
    const cachedEnquiries = await redis.get(cacheKey);

    if (cachedEnquiries) {
      return res
        .status(200)
        .json({ status: "SUCCESS", data: JSON.parse(cachedEnquiries) });
    }
    const enquiries = await query; // Use the constructed query
    await redis.set(cacheKey, JSON.stringify(enquiries), "EX", 86400);
    res.status(200).json({ status: "SUCCESS", data: enquiries });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createAnEnquiry,
  updateAnEnquiryStatus,
  deleteAnEnquiry,
  getAnEnquiry,
  getAllEquiries,
};
