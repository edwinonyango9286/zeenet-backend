const express = require("express");
const {createProductCategory, updateProductCategory, deleteProductCategory, getAProductCategory, getAllProductCartegories} = require("../controllers/productCategoryCtrl")
const router = express.Router();

router.post("/createproductcategory",createProductCategory);
router.put("/updateproductcategory/:id",updateProductCategory)
router.delete("/deleteproductcategory/:id",deleteProductCategory)
router.get("/singleproductcategory/:id",getAProductCategory);
router.get("/getallproductcategories",getAllProductCartegories)

module.exports = router;