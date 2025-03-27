const express = require("express");
const { createBrand, updateBrand, deleteBrand, getBrand, getallBrands } = require("../controllers/brandCtrl");
const router = express.Router();

router.post("/create",createBrand);
router.put("/update/:id",updateBrand)
router.delete("/delete/:id",deleteBrand)
router.get("/getabrand/:id",getBrand);
router.get("/getallbrands",getallBrands)

module.exports = router;