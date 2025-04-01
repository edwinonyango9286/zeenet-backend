const express = require("express");
const {createProduct,getallProducts,getaProduct,updateProduct,deleteProduct,addToWishlist,rating,} = require("../controllers/productCtrl");

const router = express.Router();

router.post("/create",createProduct);
router.get("/:productId", getaProduct);
router.put("/update/:productId",updateProduct);
router.put("/wishlist",addToWishlist);
router.put("/rating",rating);
router.delete("/delete/:productId",deleteProduct);
router.get("/products", getallProducts);

module.exports = router;
