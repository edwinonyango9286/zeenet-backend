const express = require("express");
const router = express.Router();
const {createBlog,updateBlog,getABlog,getAllBlogs,deleteBlog,liketheBlog,dislikeTheBlog,uploadBlogImages,} = require("../controllers/blogCtrl");
const { uploadPhoto, blogImgResize } = require("../middlewares/uploadImage");
const { verifyUserToken } = require("../middlewares/authMiddleware");
const { authorisedRoles } = require("../middlewares/roleMiddleware");

router.post("/blogs", verifyUserToken ,authorisedRoles("Admin", "Manager") ,createBlog);
router.patch("/upload/:id",uploadPhoto.array("images", 10),blogImgResize,uploadBlogImages)
router.patch("/like",liketheBlog)
router.patch("/dislike",dislikeTheBlog)
router.patch("/update/:id",updateBlog);
router.get("/:id", getABlog);
router.get("/blogs/all", getAllBlogs);
router.delete("/delete/:id",deleteBlog);


module.exports = router;
