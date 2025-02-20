const express = require("express");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
  addABlogCategory,
  updateABlogCategory,
  deleteABlogCategory,
  getABlogCategory,
  getAllBlogCategories,
} = require("../controllers/blogCategoryCtrl");
const router = express.Router();

router.post("/create", authMiddleware, isAdmin, addABlogCategory);
router.put("/update/:id", authMiddleware, isAdmin, updateABlogCategory);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteABlogCategory);
router.get("/get/:id", getABlogCategory);
router.get("/getblogcategories", getAllBlogCategories);

module.exports = router;
