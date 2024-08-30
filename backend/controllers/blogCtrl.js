const Blog = require("../models/blogModel");
const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const validateMongodbId = require("../utils/validateMongodbId");
const cloudinaryUploadingImg = require("../utils/cloudinary");
const fs = require("fs");

const createBlog = expressAsyncHandler(async (req, res) => {
  const newBlog = await Blog.create(req.body);
  res.json(newBlog);
});

const updateBlog = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json(updatedBlog);
});

const getBlog = expressAsyncHandler(async (req, res) => {
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
  res.json(getBlog);
});

const getAllBlogs = expressAsyncHandler(async (req, res) => {
  const getBlogs = await Blog.find();
  res.json(getBlogs);
});

const deleteBlog = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const deletedBlog = await Blog.findByIdAndDelete(id);
  res.json(deletedBlog);
});

const liketheBlog = expressAsyncHandler(async (req, res) => {
  const { blogId } = req.body;
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
});

const dislikeTheBlog = expressAsyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongodbId(blogId);
  const blog = await Blog.findById(blogId);
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
});

const uploadBlogImages = expressAsyncHandler(async (req, res) => {
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
