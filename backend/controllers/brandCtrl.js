const Brand = require("../models/brandModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createBrand = expressAsyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.status(201).json(newBrand);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBrand = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBrand) {
      throw new Error("Brand not found.");
    }
    res.status(200).json(updatedBrand);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBrand = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const deletedBrand = await Brand.findByIdAndDelete(id);
    if (!deletedBrand) {
      throw new Error("Brand not found.");
    }
    res.status(200).json(deletedBrand);
  } catch (error) {
    throw new Error(error);
  }
});

const getBrand = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const brand = await Brand.findById(id);
    if (!brand) {
      throw new Error("Brand not found.");
    }
    res.status(200).json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

const getallBrands = expressAsyncHandler(async (req, res) => {
  try {
    const getallBrands = await Brand.find();
    res.status(200).json(getallBrands);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getallBrands,
};
