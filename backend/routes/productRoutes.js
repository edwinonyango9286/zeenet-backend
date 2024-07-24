const express = require("express");
const {
  createProduct,
  getallProducts,
  getaProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
} = require("../controllers/productCtrl");

const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create", authMiddleware, isAdmin, createProduct);
router.get("/getaproduct/:id", getaProduct);
router.put("/update/:id", authMiddleware, isAdmin, updateProduct);
router.put("/addtowishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteProduct);
router.get("/allproducts", getallProducts);

module.exports = router;
