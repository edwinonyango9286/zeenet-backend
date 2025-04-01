const Brand = require("../models/brandModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const _ = require("lodash");

const createBrand = expressAsyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      throw new Error("Please provide all the required fields.");
    }
    // check for brand with similar name => case insensitive search
    const existingBrand = await Brand.findOne({
      name: new RegExp(`^${name}`, "i"),
    });
    if (existingBrand) {
      throw new Error("A brand with a similar name already exist.");
    }
    const newBrand = await Brand.create({
      ...req.body,
      name: _.capitalize(name),
      description: _.capitalize(description),
      // this id is validated at the model level
      createdBy: req.user._id,
    });
    return res.status(201).json({
      status: "SUCCESS",
      message: "Brand added successfully",
      data: newBrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateBrand = expressAsyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || description) {
      throw new Error("Please provide all the required fields.");
    }
    const { id } = req.params;
    validateMongodbId(id);
    const updatedBrand = await Brand.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      {
        ...req.body,
        name: _.capitalize(name),
        description: _.capitalize(description),
      },
      {
        new: true,
      }
    );
    if (!updatedBrand) {
      throw new Error("Brand not found.");
    }
    return res.status(200).json({
      status: "SUCCESS",
      message: "Brand updated successfully.",
      data: updatedBrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBrand = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const deletedBrand = await Brand.findOneAndUpdate(
      {
        _id: id,
        createdBy: req.user._id,
      },
      { isDeleted: true, deletedAt: Date.now() },
      {
        new: true,
      }
    );
    if (!deletedBrand) {
      throw new Error("Brand not found.");
    }
    return res.status(200).json({
      status: "SUCCESS",
      message: "Brand deleted successfully.",
      data: deletedBrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// this should not return a deleted brand
const getBrand = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const brand = await Brand.findOne({ _id: id, isDeleted: false });
    if (!brand) {
      throw new Error("Brand not found.");
    }
    res.status(200).json({ status: "SUCCESS", data: brand });
  } catch (error) {
    throw new Error(error);
  }
});

// Get all brands by user => users should only see brands whose visibility is published
const getallBrands = expressAsyncHandler(async (req, res) => {
  try {
    const brands = await Brand.find({
      isDeleted: false,
      visibility: "Published",
    });
    return res.status(200).json({ status: "SUCCESS", data: brands });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBrandsByAdmin = expressAsyncHandler(async (req, res) => {
  try {
    // an admin should only see the brands he/she created
    const brands = await Brand.find({});
  } catch (error) {}
});

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getallBrands,
};
