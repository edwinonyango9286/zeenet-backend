const ProductCategory = require("../models/productCategoryModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createProductCategory = expressAsyncHandler(async (req, res) => {
  const newProductCategory = await ProductCategory.create(req.body);
  res.json(newProductCategory);
});

const updateProductCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const updatedproductcategory = await ProductCategory.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );
  res.json(updatedproductcategory);
});

const deleteProductCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const deletedProductCategory = await ProductCategory.findByIdAndDelete(id);
  res.json(deletedProductCategory);
});

const getAProductCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const getTheProductCategory = await ProductCategory.findById(id);
  res.json(getTheProductCategory);
});

const getAllProductCartegories = expressAsyncHandler(async (req, res) => {
  const allProductCategories = await ProductCategory.find();
  res.json(allProductCategories);
});

module.exports = {
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
  getAProductCategory,
  getAllProductCartegories,
};
