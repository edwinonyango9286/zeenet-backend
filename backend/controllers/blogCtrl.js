const Blog = require("../models/blogModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const cloudinaryUploadingImg = require("../utils/cloudinary");
const fs = require("fs");
const _ = require("lodash")
const { descriptionFormater}  = require("../utils/stringFormatters");
const redis = require("../utils/redis");

const createBlog = expressAsyncHandler(async (req, res) => {
  try {
    const { name, description, shortDescription , category, images } = req.body;
    if (!name || !description || !category || !images || !shortDescription) {
      throw new Error("Please provide all the required fields.");
    }
    const createdBlog = await Blog.create({...req.body,  createdBy:req.user._id , name:_.startCase(_.toLower(name)), description: descriptionFormater(description), shortDescription:descriptionFormater(shortDescription)});
    // invalidate list of all blogs
    const cacheKey = `blogs:*`;
    const keys = await redis.keys(cacheKey);
    keys.forEach((key)=>{redis.del(key)})
    
   return res.status(201).json({ status:"SUCCESS", message:"Blog created successfully.", data: createdBlog,});
  } catch (error) {
    throw new Error(error);
  }
});



const updateBlog = expressAsyncHandler(async (req, res) => {
  try {
    const { title, description, category, images } = req.body;
    if (!title || !description || !category || !images) {
      throw new Error("Please provide all the required fields.");
    }
    const { id } = req.params;
    validateMongodbId(id);
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedBlog);
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
    await Blog.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $inc: { numberOfViews: 1 } },
      { new: true, runValidators: true }
    );

    // If the blog is cached, return it
    if (cachedBlog) {
      const blog = JSON.parse(cachedBlog);
      blog.numberOfViews += 1;
      await redis.set(cacheKey, JSON.stringify(blog), "EX", 3600); // Update the cache
      return res.status(200).json({ status: "SUCCESS", data: blog });
    }

    // If not cached, fetch from the database
    const blog = await Blog.findOne({ _id: id, isDeleted: false }).populate({ path: "likes", select: "firstName lastName" }).populate({ path: "dislikes", select: "firstName lastName" }).populate({ path: "createdBy", select: "firstName lastName" }).populate({ path: "updatedBy", select: "firstName lastName" });
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



    const blogs = await Blog.find().populate("category");
    res.status(200).json(blogs);
  } catch (error) {
    throw new Error(error);
  }
});



const deleteBlog = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      throw new Error("Blog not found.");
    }
    res.status(200).json(deletedBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const liketheBlog = expressAsyncHandler(async (req, res) => {
  try {
    const { blogId } = req.body;
    if (!blogId) {
      throw new Error("Please provide the blog Id.");
    }
    validateMongodbId(blogId);
    const blog = await Blog.findById(blogId);
    const loginUserId = req?.user?._id;
    const isLiked = blog?.isLiked;
    const alreadyDisliked = blog?.dislikes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.json(blog);
    }
    if (isLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const dislikeTheBlog = expressAsyncHandler(async (req, res) => {
  try {
    const { blogId } = req.body;
    if (!blogId) {
      throw new Error("Please provide a blog Id");
    }
    validateMongodbId(blogId);
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new Error("Blog not found.");
    }
    const loginUserId = req?.user?._id;
    const isDisliked = blog?.isDisliked;
    const alreadyLiked = blog?.likes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyLiked) {
      const blog = await blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    }
    if (isDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: loginUserId },
          isDisliked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const uploadBlogImages = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const uploader = (path) => cloudinaryUploadingImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync("path");
    }
    const findBlog = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );
    res.json(findBlog);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlog,
  updateBlog,
  getABlog,
  getAllBlogs,
  deleteBlog,
  liketheBlog,
  dislikeTheBlog,
  uploadBlogImages,
};
