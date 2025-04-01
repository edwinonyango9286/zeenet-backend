const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const County = require("../models/countyModel");

const createCounty = expressAsyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw new Error("Please provide all the required fields");
    }
    const newCounty = await County.create(req.body);
    res.status(201).json(newCounty);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCounty = expressAsyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw new Error("Please provide all the required fields.");
    }
    const { id } = req.params;
    validateMongodbId(id);
    const updatedCounty = await County.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedCounty) {
      throw new Error("County not found.");
    }
    res.status(200).json(updatedCounty);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCounty = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const deletedCounty = await County.findByIdAndDelete(id);
    if (!deletedCounty) {
      throw new Error("County not found.");
    }
    res.status(200).json(deletedCounty);
  } catch (error) {
    throw new Error(error);
  }
});

const getCounty = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const county = await County.findById(id);
    if (!county) {
      throw new Error("county not found.");
    }
    res.status(200).json(county);
  } catch (error) {
    throw new Error(error);
  }
});

const getallCounties = expressAsyncHandler(async (req, res) => {
  try {
    const counties = await County.find();
    res.status(200).json(counties);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCounty,
  updateCounty,
  deleteCounty,
  getCounty,
  getallCounties,
};
