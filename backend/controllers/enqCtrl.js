const Enquiry = require("../models/enquiryModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const { response } = require("express");

const createEnquiry = expressAsyncHandler(async (req, res) => {
  try {
    const newEnquiry = await Enquiry.create(req.body);
    res.json(newEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});


const updateEnquiry = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json(updatedEnquiry);
});

const deleteEnquiry = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const deletedenquiry = await Enquiry.findByIdAndDelete(id);
  res.json(deletedenquiry);
});

const getanEnquiry = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const getanenquiry = await Enquiry.findById(id);
  res.json(getanenquiry);
});


const getAllEquiries = expressAsyncHandler(async (req, res) => {
  const getallenquiries = await Enquiry.find();
  res.json(getallenquiries);
});

module.exports = {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getanEnquiry,
  getAllEquiries,
};
