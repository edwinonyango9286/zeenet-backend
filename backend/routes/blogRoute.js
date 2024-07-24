const express = require("express");
const router = express.Router();
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  liketheBlog,
  dislikeTheBlog,
  uploadBlogImages,
} = require("../controllers/blogCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { uploadPhoto, blogImgResize } = require("../middlewares/uploadImage");

router.post("/create", authMiddleware, isAdmin, createBlog);
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array("images", 10),
  blogImgResize,
  uploadBlogImages)
router.put("/like", authMiddleware, liketheBlog)
router.put("/dislike", authMiddleware, dislikeTheBlog)
router.put("/update/:id", authMiddleware, isAdmin, updateBlog);
router.get("/get/:id", getBlog);
router.get("/getall", getAllBlogs);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteBlog);


module.exports = router;
