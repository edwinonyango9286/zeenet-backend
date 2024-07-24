const express = require("express");
const {isAdmin, authMiddleware} = require("../middlewares/authMiddleware");
const { createBrand, updateBrand, deleteBrand, getBrand, getallBrands } = require("../controllers/brandCtrl");
const router = express.Router();

router.post("/create",authMiddleware,isAdmin,createBrand);
router.put("/update/:id",authMiddleware,isAdmin,updateBrand)
router.delete("/delete/:id",authMiddleware,isAdmin,deleteBrand)
router.get("/getabrand/:id",getBrand);
router.get("/getallbrands",getallBrands)

module.exports = router;