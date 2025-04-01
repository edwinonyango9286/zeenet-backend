const express = require("express");
const router = express.Router();
const {createBlog,updateABlog,getABlog,getAllBlogs,deleteBlog,likeABlog,dislikeABlog,uploadBlogImages,} = require("../controllers/blogCtrl");
const { uploadPhoto, blogImgResize } = require("../middlewares/uploadImage");
const { verifyUserToken } = require("../middlewares/authMiddleware");
const { authorisedRoles } = require("../middlewares/roleMiddleware");

router.post("/blogs", verifyUserToken ,authorisedRoles("Admin", "Manager") ,createBlog);
router.patch("/:id/uploadImages", verifyUserToken , authorisedRoles("Admin", "Manager"), uploadPhoto.array("images", 10),blogImgResize,uploadBlogImages)
router.patch("/like",verifyUserToken, likeABlog)
router.patch("/dislike", verifyUserToken , dislikeABlog)
router.patch("/:id/update", verifyUserToken, authorisedRoles("Admin", "Manager"), updateABlog);
router.get("/:id", getABlog);
router.get("/blogs/all", getAllBlogs);
router.patch("/:id/delete", verifyUserToken, authorisedRoles("Admin", "Manager") ,deleteBlog);


module.exports = router;
