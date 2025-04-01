const express = require("express");
const router = express.Router();
const { createCoupon,updateCoupon,getAllCoupons,deleteCoupon,getACoupon} = require("../controllers/couponCtrl");

router.post("/create",createCoupon)
router.put("/update/:id",updateCoupon)
router.delete("/delete/:id",deleteCoupon)
router.get("/get/:id",getACoupon);
router.get("/getall",getAllCoupons);



module.exports = router;
