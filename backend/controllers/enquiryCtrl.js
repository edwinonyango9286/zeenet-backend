const Enquiry = require("../models/enquiryModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createEnquiry = expressAsyncHandler(async (req, res) => {
  try {
    const createdEnquiry = await Enquiry.create(req.body);
    res.status(201).json(createdEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});

const updateEnquiry = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedEnquiry) {
      throw new Error("Enquiry not found.");
    }
    res.status(200).json(updatedEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteEnquiry = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const deletedenquiry = await Enquiry.findByIdAndDelete(id);
    if (!deleteEnquiry) {
      throw new Error("Enquiry not found");
    }
    res.status(200).json(deletedenquiry);
  } catch (error) {
    throw new Error(error);
  }
});

const getAnEnquiry = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      throw new Error("Enquiry not found.");
    }
    res.status(200).json(enquiry);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllEquiries = expressAsyncHandler(async (req, res) => {
  try {
    const enquiries = await Enquiry.find();
    res.status(200).json(enquiries);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getAnEnquiry,
  getAllEquiries,
};
