const ProductCategory = require("../models/productCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId")


const createProductCategory = asyncHandler(async (req, res) => {
   try {
      const newProductCategory = await ProductCategory.create(req.body);
      res.json(newProductCategory)
   } catch (error) {

   }
});

const updateProductCategory = asyncHandler(async (req, res) => {
   const { id } = req.params;
   validateMongodbId(id)
   try {
      const updatedproductcategory = await ProductCategory.findByIdAndUpdate(id, req.body, { new: true });
      res.json(updatedproductcategory)
   } catch (error) {
      throw new Error(error)
   }
});

const deleteProductCategory = asyncHandler(async (req, res) => {
   const { id } = req.params;
   validateMongodbId(id);
   try {
      const deletedProductCategory = await ProductCategory.findByIdAndDelete(id);
      res.json(deletedProductCategory);
   } catch (error) {
      throw new Error(error)
   }
});

const getAProductCategory = asyncHandler(async (req, res) => {
   const { id } = req.params;
   validateMongodbId(id);
   try {
      const getTheProductCategory = await ProductCategory.findById(id);
      res.json(getTheProductCategory)
   } catch (error) {
      throw new Error(error)
   }
});

const getAllProductCartegories = asyncHandler(async (req, res) => {

   try {
      const allProductCategories = await ProductCategory.find();
      res.json(allProductCategories)
   } catch (error) {
      throw new Error(error)
   }
});

module.exports = { createProductCategory, updateProductCategory, deleteProductCategory, getAProductCategory, getAllProductCartegories };