const Brand = require("../models/brandModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createBrand = expressAsyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
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
      // this id is validate at the model level
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
    const { name } = req.body;
    if (!name) {
      throw new Error("Please provide all the required fields.");
    }
    const { id } = req.params;
    validateMongodbId(id);
    const updatedBrand = await Brand.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      req.body,
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
    const brands = await Brand.find({
      isDeleted: false,
    });
    return res.status(200).json({ status: "SUCCESS", data: brands });
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
