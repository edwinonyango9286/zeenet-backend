const Category = require("../models/blogCategoryModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createaCategory = expressAsyncHandler(async (req, res) => {
  const newCategory = await Category.create(req.body);
  res.json(newCategory);
});

const updateaCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json(updatedCategory);
});

const deleteaCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const deletedCategory = await Category.findByIdAndDelete(id);
  res.json(deletedCategory);
});

const getaCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const getaCategory = await Category.findById(id);
  res.json(getaCategory);
});

const getallCategories = expressAsyncHandler(async (req, res) => {
  const getallCategories = await Category.find();
  res.json(getallCategories);
});

module.exports = {
  createaCategory,
  updateaCategory,
  deleteaCategory,
  getaCategory,
  getallCategories,
};
