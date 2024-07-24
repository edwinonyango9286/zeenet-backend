const Enquiry = require("../models/enquiryModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const { response } = require("express");

const createEnquiry = asyncHandler(async (req, res) => {
  try {
    const newEnquiry = await Enquiry.create(req.body);
    res.json(newEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});


const updateEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deletedenquiry = await Enquiry.findByIdAndDelete(id);
    res.json(deletedenquiry);
  } catch (error) {
    throw new Error(error);
  }
});

const getanEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getanenquiry = await Enquiry.findById(id);
    res.json(getanenquiry);
  } catch (error) {
    throw new Error(error);
  }
});


const getAllEquiries = asyncHandler(async (req, res) => { 
  try {
    const getallenquiries = await Enquiry.find();
    res.json(getallenquiries);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getanEnquiry,
  getAllEquiries,
};
