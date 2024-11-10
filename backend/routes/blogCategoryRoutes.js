const express = require("express");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
  createaCategory,
  updateaCategory,
  deleteaCategory,
  getaCategory,
  getallCategories,
} = require("../controllers/blogCategoryCtrl");
const router = express.Router();

router.post("/create", authMiddleware, isAdmin, createaCategory);
router.put("/update/:id", authMiddleware, isAdmin, updateaCategory);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteaCategory);
router.get("/get/:id", getaCategory);
router.get("/getblogcategories", getallCategories);

module.exports = router;
