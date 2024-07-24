const express = require("express");
const router = express.Router();
const {isAdmin ,authMiddleware}= require("../middlewares/authMiddleware");
const { createCoupon,updateCoupon,getAllCoupons,deleteCoupon,getACoupon} = require("../controllers/couponCtrl");

router.post("/create",authMiddleware,isAdmin,createCoupon)
router.put("/update/:id",authMiddleware,isAdmin,updateCoupon)
router.delete("/delete/:id",authMiddleware,isAdmin,deleteCoupon)
router.get("/get/:id",authMiddleware,isAdmin,getACoupon);
router.get("/getall", authMiddleware,isAdmin,getAllCoupons);



module.exports = router;
