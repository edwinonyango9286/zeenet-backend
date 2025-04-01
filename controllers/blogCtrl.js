const Blog = require("../models/blogModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const {cloudinaryUploadImg} = require("../utils/cloudinary");
const fs = require("fs");
const _ = require("lodash")
const { paragraphFormater}  = require("../utils/stringFormatters");
const redis = require("../utils/redis");


const createBlog = expressAsyncHandler(async (req, res) => {
  try {
    const { name, description, shortDescription , category, images } = req.body;
    if (!name || !description || !category || !images || !shortDescription) {
      throw new Error("Please provide all the required fields.");
    }
    const createdBlog = await Blog.create({...req.body,  createdBy:req.user._id , name:_.startCase(_.toLower(name)), description: paragraphFormater(description), shortDescription:paragraphFormater(shortDescription)});
    // invalidate list of all blogs
    const cacheKey = `blogs:*`;
    const keys = await redis.keys(cacheKey);
    keys.forEach((key)=>{redis.del(key)})
    
   return res.status(201).json({ status:"SUCCESS", message:"Blog created successfully.", data: createdBlog,});
  } catch (error) {
    throw new Error(error);
  }
});



const updateABlog = expressAsyncHandler(async (req, res) => {
  try {
    const { name, description, shortDescription, category, images } = req.body;
    if (!name || !description || !shortDescription || !category || !images) {
      throw new Error("Please provide all the required fields.");
    }
    const { id } = req.params;
    validateMongodbId(id);

    const updatedBlog = await Blog.findOneAndUpdate({_id: id , isDeleted:false }, {...req.body, name:_.startCase(_.toLower(name)), description:paragraphFormater(description), shortDescription: paragraphFormater(shortDescription), updatedBy: req.user._id}, {new: true, runValidators:true});
    if(!updatedBlog){
      throw new Error("Blog not found.")
    }

    // invalid single cache key
    const singleCacheKey = `blog:${id}`
    await redis.del(singleCacheKey)

    // invalidate list of blogs 
    const listCacheKey = `blogs:*`;
    const keys = await redis.keys(listCacheKey);
    keys.forEach((key)=> redis.del(key));

    return res.status(200).json({ status:"SUCCESS", message:"Blog updated successfully.", data:updatedBlog});
  } catch (error) {
    throw new Error(error);
  }
});



const getABlog = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);

    const cacheKey = `blog:${id}`;
    const cachedBlog = await redis.get(cacheKey);

    // Increment the view count in the database
    await Blog.findOneAndUpdate({ _id: id, isDeleted: false },{ $inc: { numberOfViews: 1 } },{ new: true, runValidators: true });

    // If the blog is cached, return it
    if (cachedBlog) {
      const blog = JSON.parse(cachedBlog);
      blog.numberOfViews += 1;
      await redis.set(cacheKey, JSON.stringify(blog), "EX", 3600); // Update the cache
      return res.status(200).json({ status: "SUCCESS", data: blog });
    }

    // If not cached, fetch from the database
    const blog = await Blog.findOne({ _id: id, isDeleted: false }).populate({ path: "likes", select: "firstName lastName" }).populate({ path: "dislikes", select: "firstName lastName" }).populate({ path: "createdBy", select: "firstName lastName" }).populate({ path: "updatedBy", select: "firstName lastName" }).populate({ path:"category" , select:"name"});
    if (!blog) {
      throw new Error("Blog not found.")
    }
    await redis.set(cacheKey, JSON.stringify(blog), "EX", 3600);
    return res.status(200).json({ status: "SUCCESS", data: blog });
  } catch (error) {
    throw new Error(error)
  }
});




const getAllBlogs = expressAsyncHandler(async (req, res) => {
  try {
    const queryObject = {...req.query};
    const excludeFields = ["page", "sort", "limit", "offset", "fields"];
    excludeFields.forEach((el)=> delete queryObject[el]);

    let query = Blog.find({...queryObject, isDeleted:false}).populate({ path:"createdBy" , select:"firstName lastName"}).populate({ path:"updatedBy" , select:"firstName lastName" }).populate({ path: "deletedBy" , select:"firstName lastName" }).populate({ path:"category" , select:"name"})

if(req.query.sort){
  const sortBy = req.query.sort.split(",").join(" ")
  query = query.sort(sortBy)
}else{
  query = query.sort("-createdAt")
}

if(req.query.fields){
  const fields = req.query.fields.split(",").join(" ")
  query =query.select(fields)
}else{
  query = query.select("-__v")
}

const limit = Math.min(parseInt(req.query.limit, 10) || 10,100)
const offset = Math.max(parseInt(req.query.offset, 10) || 0,0)
query = query.skip(offset).limit(limit)


const cacheKey = `blogs:${JSON.stringify(queryObject)}:${req.query.sort}:${req.query.fields}:${limit}:${offset}`
const cachedBlogs = await redis.get(cacheKey);
if(cachedBlogs){
  const cachedData =JSON.parse(cachedBlogs);
  return res.status(200).json({ status:"SUCCESS", data: cachedData.data , totalCount : cachedData.totalCount ,  totalPages: cachedData.totalPages, limit ,offset})
}

    const blogs = await  query
    const totalCount = await Blog.countDocuments({...queryObject, isDeleted:false })
    const totalPages =Math.ceil(totalCount/limit);

    const chacheData = { data: blogs, totalCount,totalPages};
    await redis.set(cacheKey, JSON.stringify(chacheData), "EX",3600)
   return res.status(200).json({ status:"SUCCESS", data:blogs, totalCount, totalPages, limit, offset});
  } catch (error) {
    throw new Error(error);
  }
});



const deleteBlog = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const deletedBlog = await Blog.findOneAndUpdate({ _id:id, isDeleted:false},{ isDeleted:true, deletedAt: Date.now(), deletedBy: req.user._id}, {new:true, runValidators:true});
    if (!deletedBlog) {
      throw new Error("Blog not found.");
    }

    // invalidate the single blog
    const singleCacheKey = `blog:${id}`;
    await redis.del(singleCacheKey);

 // invalidate list of blogs 
  const listCacheKey = `blogs:*`;
  const keys = await redis.keys(listCacheKey);
  keys.forEach((key)=> redis.del(key));

   return res.status(200).json({ status:"SUCCESS", message:"Blog deleted successfully.", data:deletedBlog});
  } catch (error) {
    throw new Error(error);
  }
});



const likeABlog = expressAsyncHandler(async (req, res) => {
  try {
    const { blogId } = req.body;
    if (!blogId) {
      throw new Error("Please provide the blog Id.");
    }
    validateMongodbId(blogId);
    const blog = await Blog.findOne({ _id:blogId, isDeleted:false});
    if(!blog){
      throw new Error("Blog not found.")
    }
    const signedInUserId = req?.user?._id;
    const isLiked = blog?.isLiked;
    const alreadyDisliked = blog?.dislikes?.find((userId) => userId?.toString() === signedInUserId?.toString());
    if (alreadyDisliked) {
      const blog = await Blog.findOneAndUpdate({ _id:blogId, isDeleted:false},{$pull: { dislikes: signedInUserId },isDisliked: false},{ new: true, runValidators:true });
     return res.status(200).json({ status:"SUCCESS", message:"Blog liked successfully.",  data:blog});
    }
    if (isLiked) {
      const blog = await Blog.findOneAndUpdate({ _id: blogId , isDeleted:false},{$pull: { likes: signedInUserId },isLiked: false},{ new: true, runValidators:true });
    return   res.status(200).json({ status:"SUCCESS", message:"Blog liked successfully." , data:blog});
    } else {
    const blog = await Blog.findOneAndUpdate({_id:blogId, isDeleted:false},{$push: { likes: signedInUserId }, isLiked: true},{ new: true, runValidators:true });
    return  res.status(200).json({status:"SUCCESS", message:"Blog liked successfully.", data:blog});
    }
  } catch (error) {
    throw new Error(error);
  }
});


const dislikeABlog = expressAsyncHandler(async (req, res) => {
  try {
    const { blogId } = req.body;
    if (!blogId) {
      throw new Error("Please provide a blog id.");
    }
    validateMongodbId(blogId);
    const blog = await Blog.findOne({ _id:blogId , isDeleted:false});
    if (!blog) {
      throw new Error("Blog not found.");
    }

    const signedUserId = req?.user?._id;
    const isDisliked = blog?.isDisliked;
    const alreadyLiked = blog?.likes?.find((userId) => userId?.toString() === signedUserId?.toString());
    if (alreadyLiked) {
      const blog = await Blog.findOneAndUpdate({ _id:blogId, isDeleted:false},{$pull: { likes: signedUserId },isLiked: false},{ new: true, runValidators:true });
     return  res.status(200).json({ status:"SUCCESS", message:"Blog disliked successfully.", data:blog});
    }
    if (isDisliked) {
      const blog = await Blog.findOneAndUpdate({ _id:blogId, isDeleted:false},{$pull: { dislikes: signedUserId },isDisliked: false},{ new: true, runValidators:true });
     return res.status(200).json({ status:"SUCCESS", message:"Blog disliked successfully." , data:blog});
    } else {
      const blog = await Blog.findOneAndUpdate({ _id:blogId, isDeleted:false},{$push: { dislikes: signedUserId },isDisliked: true},{ new: true, runValidators:true });
     return res.status(200).json({status:"SUCCESS", message:"Blog disliked successfully.", data:blog});
    }
  } catch (error) {
    throw new Error(error);
  }
});



const uploadBlogImages = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    const blog = await Blog.findOneAndUpdate({ _id:id, isDeleted:false},{images: urls.map((file) => {return file})},{ new: true, runValidators:true});
    if(!blog){
      throw new Error("Blog not found.")
    }
     return res.status(200).json({ status:"SUCCESS", message:"Blog images uploaded successfully.",  data:blog,});
  } catch (error) {
    throw new Error(error);
  }
});



module.exports = {
  createBlog,
  updateABlog,
  getABlog,
  getAllBlogs,
  deleteBlog,
  likeABlog,
  dislikeABlog,
  uploadBlogImages,
};
