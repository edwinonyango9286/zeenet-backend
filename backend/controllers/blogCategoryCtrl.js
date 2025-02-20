const BlogCategory = require("../models/blogCategoryModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const redis = require("../utils/redis");

const addABlogCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      throw new Error("Please provide all the required fields");
    }
    const createdBlogCategory = await BlogCategory.create(req.body);
    const cacheKey = `blogCategories:*`;
    const keys = await redis.keys(cacheKey);
    keys.forEach((key) => {
      redis.del(key);
    });
    return res.status(201).json({
      status: "SUCCESS",
      message: "Blog category created successfully.",
      data: createdBlogCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// When updating consider  data in the redis
const updateABlogCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      throw new Error("Please provide all the required fields");
    }
    const { id } = req.params;
    validateMongodbId(id);
    const updatedBlogCategory = await BlogCategory.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedBlogCategory) {
      throw new Error("Blog category not found.");
    }
    const cacheKey = `blogCategories:*`;
    const keys = await redis.keys(cacheKey);
    keys.forEach((key) => {
      redis.del(key);
    });
    return res.status(200).json({
      status: "SUCCESS",
      message: "Blog updated successfully",
      data: updatedBlogCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteABlogCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const deletedBlogCategory = await BlogCategory.findByIdAndDelete(id);
    if (!deletedBlogCategory) {
      throw new Error("Blog category not found.");
    }
    const cacheKey = `blogCategories:*`;
    const keys = await redis.keys(cacheKey);
    keys.forEach((key) => {
      redis.del(key);
    });
    return res.status(200).json({
      status: "SUCCESS",
      message: "Blog deleted successfully",
      data: deletedBlogCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getABlogCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const cacheKey = `blogCategory:${id}`;
    const cachedBlogCategory = await redis.get(cacheKey);
    if (cachedBlogCategory) {
      return res
        .status(200)
        .json({ status: "SUCCESS", data: JSON.parse(cachedBlogCategory) });
    }
    const blogCategory = await BlogCategory.findById(id);
    if (!blogCategory) {
      throw new error("Blog category not found.");
    }
    await redis.set(cacheKey, JSON.stringify(blogCategory), "EX", 3600);
    return res.status(200).json({ status: "SUCCESS", blogCategory });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlogCategories = expressAsyncHandler(async (req, res) => {
  try {
    const queryObject = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "offset", "fields"];
    excludeFields.forEach((el) => delete queryObject[el]);

    // for some reason isDeleted is returning an empty array.
    queryObject.isDeleted = false;
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = BlogCategory.find(JSON.parse(queryStr));

    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    // field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }
    // pagination
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;
    query = query.skip(offset).limit(limit);

    // caching categories
    const cacheKey = `blogCategories:${JSON.stringify(queryObject)}:${
      req.query.sort
    }:${req.query.fields}:${limit}:${offset}`;
    const cachedBlogCategories = await redis.get(cacheKey);
    if (cachedBlogCategories) {
      return res
        .status(200)
        .json({ status: "SUCCESS", data: JSON.parse(cachedBlogCategories) });
    }
    const blogCategories = await BlogCategory.find();
    await redis.set(cacheKey, JSON.stringify(blogCategories), "EX", 3600);
    res.status(200).json({ status: "SUCCESS", data: blogCategories });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  addABlogCategory,
  updateABlogCategory,
  deleteABlogCategory,
  getABlogCategory,
  getAllBlogCategories,
};
