const express = require("express");
const {createProductCategory, updateProductCategory, deleteProductCategory, getAProductCategory, getAllProductCartegories} = require("../controllers/productCategoryCtrl")
const {isAdmin, authMiddleware} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/createproductcategory",authMiddleware,isAdmin,createProductCategory);
router.put("/updateproductcategory/:id",authMiddleware,isAdmin,updateProductCategory)
router.delete("/deleteproductcategory/:id",authMiddleware,isAdmin,deleteProductCategory)
router.get("/singleproductcategory/:id",getAProductCategory);
router.get("/getallproductcategories",getAllProductCartegories)

module.exports = router;