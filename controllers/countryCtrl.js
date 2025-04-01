const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const Country = require("../models/countryModel");

const createCountry = expressAsyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw new Error("Please provide all the required fields");
    }
    const newCountry = await Country.create(req.body);
    res.status(201).json(newCountry);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCountry = expressAsyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw new Error("Please provide all the required fields.");
    }
    const { id } = req.params;
    validateMongodbId(id);
    const updatedCountry = await Country.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedCountry) {
      throw new Error("Country not found.");
    }
    res.status(200).json(updatedCountry);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCountry = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const deletedCountry = await Country.findByIdAndDelete(id);
    if (!deletedCountry) {
      throw new Error("Country not found.");
    }
    res.status(200).json(deletedCountry);
  } catch (error) {
    throw new Error(error);
  }
});

const getCountry = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const country = await Country.findById(id);
    if (!country) {
      throw new Error("country not found.");
    }
    res.status(200).json(country);
  } catch (error) {
    throw new Error(error);
  }
});

const getallCountries = expressAsyncHandler(async (req, res) => {
  try {
    const countries = await Country.find();
    res.status(200).json(countries);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCountry,
  updateCountry,
  deleteCountry,
  getCountry,
  getallCountries,
};
