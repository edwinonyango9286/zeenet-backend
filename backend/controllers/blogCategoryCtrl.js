const BlogCategory = require("../models/blogCategoryModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const redis = require("../utils/redis");
const { json } = require("body-parser");

const createABlogCategory = expressAsyncHandler(async (req, res) => {
  try {
    const createdBlogCategory = await BlogCategory.create(req.body);
    res.json(createdBlogCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const updateABlogCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const updatedBlogCategory = await BlogCategory.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    res.json(updatedBlogCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteABlogCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const deletedBlogCategory = await BlogCategory.findByIdAndDelete(id);
    res.json(deletedBlogCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const getABlogCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const cacheKey = `blogCategory:${id}`;
    const cachedBlogCategory = await redis.get(cacheKey);
    if (cachedBlogCategory) {
      return res.json(JSON.parse(cachedBlogCategory));
    }
    const blogCategory = await BlogCategory.findById(id);
    await redis.set(cacheKey, JSON.stringify(blogCategory));
    res.json(blogCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlogCategories = expressAsyncHandler(async (req, res) => {
  try {
    const cacheKey = `blogCategories`;
    const cachedBlogCategories = await redis.get(cacheKey);
    if (cachedBlogCategories) {
      return res.json(JSON.parse(cachedBlogCategories));
    }
    const blogCategories = await BlogCategory.find();
    await redis.set(cacheKey, JSON.stringify(blogCategories));
    res.json(blogCategories);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createABlogCategory,
  updateABlogCategory,
  deleteABlogCategory,
  getABlogCategory,
  getAllBlogCategories,
};
