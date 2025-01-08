const Blog = require("../models/blogModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const cloudinaryUploadingImg = require("../utils/cloudinary");
const fs = require("fs");

const createBlog = expressAsyncHandler(async (req, res) => {
  try {
    const { title, description, category, images } = req.body;
    if (!title || !description || !category || !images) {
      throw new Error("Please provide all the required fields.");
    }
    const newBlog = await Blog.create(req.body);
    res.status(201).json(newBlog);
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

const getBlog = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const getBlog = await Blog.findById(id)
      .populate("likes")
      .populate("dislikes");

    const updateViews = await Blog.findByIdAndUpdate(
      id,
      { $inc: { numViews: 1 } },
      { new: true }
    );
    res.status(200).json(getBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlogs = expressAsyncHandler(async (req, res) => {
  try {
    const getBlogs = await Blog.find();
    res.status(200).json(getBlogs);
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
  getBlog,
  getAllBlogs,
  deleteBlog,
  liketheBlog,
  dislikeTheBlog,
  uploadBlogImages,
};
