const ProductCategory = require("../models/productCategoryModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createProductCategory = expressAsyncHandler(async (req, res) => {
  try {
    const createdProductCategory = await ProductCategory.create(req.body);
    res.status(201).json(createdProductCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const updateProductCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const updatedproductcategory = await ProductCategory.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.json(updatedproductcategory);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProductCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const deletedProductCategory = await ProductCategory.findByIdAndDelete(id);
    res.json(deletedProductCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const getAProductCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const getTheProductCategory = await ProductCategory.findById(id);
    res.json(getTheProductCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProductCartegories = expressAsyncHandler(async (req, res) => {
  try {
    const allProductCategories = await ProductCategory.find();
    res.json(allProductCategories);
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
