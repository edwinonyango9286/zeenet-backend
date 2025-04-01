const ProductCategory = require("../models/productCategoryModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createProductCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw new Error("Please provide category name.");
    }

    const existingCategory = await ProductCategory.findOne({
      name: new RegExp(`^${name}`, "i"),
    });

    if (existingCategory) {
      throw new Error("A category with a similar name already exist.");
    }
    const createdCategory = await ProductCategory.create({
      ...req.body,
      createdBy: req.user._id,
    });
    return res.status(201).json({
      status: "SUCCESS",
      message: "Category created successfully.",
      data: createdCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateProductCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const { name } = req.body;
    if (!name) {
      throw new Error("Please provide category name.");
    }
    const updatedCategory = await ProductCategory.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    return res.json({
      status: "SUCCESS",
      message: "Category updated successfully.",
      data: updatedCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// soft deletion => set is deleted to true
const deleteProductCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const deletedCategory = await ProductCategory.findOneAndUpdate(
      {
        _id: id,
        createdBy: req.user._id,
      },
      { isDeleted: true, deletedAt: Date.now() },
      {
        new: true,
      }
    );
    if (!deletedCategory) {
      throw new Error("Category not found.");
    }
    return res.json({
      status: "SUCCESS",
      message: "Category deleted successfully.",
      data: deletedCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get only product which are not deleted.
const getAProductCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const category = await ProductCategory.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!category) {
      throw new Error("Category not found.");
    }
    return res.json({ status: "SUCCESS", data: category });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProductCartegories = expressAsyncHandler(async (req, res) => {
  try {
    const categories = await ProductCategory.find({ isDeleted: false });
    return res.json({ status: "SUCCESS", data: categories });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
  getAProductCategory,
  getAllProductCartegories,
};
