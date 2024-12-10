const express = require("express");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
  createABlogCategory,
  updateABlogCategory,
  deleteABlogCategory,
  getABlogCategory,
  getAllBlogCategories,
} = require("../controllers/blogCategoryCtrl");
const router = express.Router();

router.post("/create", authMiddleware, isAdmin, createABlogCategory);
router.put("/update/:id", authMiddleware, isAdmin, updateABlogCategory);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteABlogCategory);
router.get("/get/:id", getABlogCategory);
router.get("/getblogcategories", getAllBlogCategories);

module.exports = router;
