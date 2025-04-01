const BlogCategory = require("../models/blogCategoryModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const redis = require("../utils/redis");
const _ = require("lodash");
const { paragraphFormater } = require("../utils/stringFormatters");

const addABlogCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { name, shortDescription } = req.body;
    if (!name || !shortDescription) {
      throw new Error("Please provide all the required fields");
    }
    // check for existing blog categories 
    const existingBlogCategory = await BlogCategory.findOne({ name:_.startCase(_.toLower(name)), isDeleted:false})
    if(existingBlogCategory){
      throw new Error(`Blog category ${existingBlogCategory.name} already exist.`)
    }
    const createdBlogCategory = await BlogCategory.create({...req.body,name:_.startCase(_.toLower(name)), shortDescription: paragraphFormater(shortDescription), createdBy: req.user._id});
    // Invalidate list of blog categories 
    const cacheKey = `blogCategories:*`;
    const keys = await redis.keys(cacheKey);
    keys.forEach((key) => {redis.del(key)});

    return res.status(201).json({status: "SUCCESS",message: "Blog category created successfully.",data: createdBlogCategory});
  } catch (error) {
    throw new Error(error);
  }
});

// When updating consider  data in the redis
const updateABlogCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { name, shortDescription } = req.body;
    if (!name || !shortDescription) {
      throw new Error("Please provide all the required fields");
    }
    const { id } = req.params;
    validateMongodbId(id);

    // Update the blog category
    const updatedBlogCategory = await BlogCategory.findOneAndUpdate({ _id: id, isDeleted: false },{...req.body,name: _.startCase(_.toLower(name)),shortDescription: paragraphFormater(shortDescription),updatedBy: req.user._id},{ new: true, runValidators: true });
    if (!updatedBlogCategory) {
      throw new Error("Blog category not found.");
    }
    // Invalidate the cache for the specific blog category
    const singleCacheKey = `blogCategory:${id}`;
    await redis.del(singleCacheKey); 

    // Invalidate the cache for the list of blog categories
    const listCacheKey = `blogCategories:*`; 
    const keys = await redis.keys(listCacheKey);
    keys.forEach((key) => redis.del(key)); 

    return res.status(200).json({status: "SUCCESS",message: "Blog category updated successfully.",data: updatedBlogCategory});
  } catch (error) {
    throw new Error(error);
  }
});




const deleteABlogCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const deletedBlogCategory = await BlogCategory.findOneAndUpdate({_id:id, isDeleted: false}, { isDeleted:true, deletedAt:Date.now(), deletedBy:req.user._id }, { new:true , runValidators:true});
    if (!deletedBlogCategory) {
      throw new Error("Blog category not found.");
    }

    // Invalidate the cache for the specific blog category
    const singleCacheKey = `blogCategory:${id}`
    await redis.del(singleCacheKey)

    // Invalidate the cache for the list of blog categories
    const listCacheKey = `blogCategories:*`;
    const keys = await redis.keys(listCacheKey);
    keys.forEach((key) => {redis.del(key)});
    return res.status(200).json({status: "SUCCESS",message: "Blog category deleted successfully.", data: deletedBlogCategory});
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
      return res.status(200).json({ status: "SUCCESS", data: JSON.parse(cachedBlogCategory) })
    }
    const blogCategory = await BlogCategory.findOne({_id:id, isDeleted:false });
    if (!blogCategory) {
      throw new Error("Blog category not found.");
    }
    await redis.set(cacheKey, JSON.stringify(blogCategory), "EX", 3600);
    return res.status(200).json({ status: "SUCCESS", data:blogCategory });
  } catch (error) {
    throw new Error(error);
  }
});


const getAllBlogCategories = expressAsyncHandler(async (req, res) => {
  try {
    const queryObject = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "offset", "fields"];
    excludeFields.forEach((el) => delete queryObject[el]);

    let query = BlogCategory.find({ ...queryObject, isDeleted: false })
      .populate({ path: "createdBy", select: "firstName lastName" })
      .populate({ path: "updatedBy", select: "firstName lastName" });

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Pagination
    const limit = Math.min(parseInt(req.query.limit, 10) || 10,100);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0,0);
    query = query.skip(offset).limit(limit);

    // Caching categories
    const cacheKey = `blogCategories:${JSON.stringify(queryObject)}:${req.query.sort}:${req.query.fields}:${limit}:${offset}`;
    const cachedBlogCategories = await redis.get(cacheKey);
    
    if (cachedBlogCategories) {
      const cachedData = JSON.parse(cachedBlogCategories);
      return res.status(200).json({status: "SUCCESS",data: cachedData.data,totalCount: cachedData.totalCount,totalPages: cachedData.totalPages,limit,offset})
    }

    const blogCategories = await query;
    const totalCount = await BlogCategory.countDocuments({ ...queryObject, isDeleted: false });
    const totalPages = Math.ceil(totalCount / limit);

    // Cache the blog categories along with metadata
    const cacheData = {data: blogCategories,totalCount,totalPages};
    await redis.set(cacheKey, JSON.stringify(cacheData), "EX", 3600);

    return res.status(200).json({status: "SUCCESS",data: blogCategories,totalCount,totalPages,limit,offset});
  } catch (error) {
    throw new Error(error);
  }
});



module.exports = {
  addABlogCategory,
  updateABlogCategory,
  deleteABlogCategory,
  getABlogCategory,
  getAllBlogCategories,
};
