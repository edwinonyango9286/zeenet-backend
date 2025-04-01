const express = require("express");
const {getAllUsers,getAUser,deleteAUser,updateAUser,blockUser,unBlockUser,updatePassword,resetUserPasswordToken,resetPassword,getWishlist,adddProductToCart,getUserCart,applyCoupon,createOrder,getUserOrders,getMonthWiseOrderIncome,getYearlyOrders,getAllOrders,getASingleOrder,resetAdminPasswordToken,updateOrderStatus} = require("../controllers/userCtrl");
const router = express.Router();

router.post("/reset-password-token", resetUserPasswordToken);
router.post("/reset-password-admin-token", resetAdminPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/update-password", updatePassword);
router.post("/cart", adddProductToCart);
router.get("/getusercart", getUserCart);
router.post("/addtocart/applycoupon", applyCoupon);
router.post("/cart/create-order", createOrder);
router.get("/get_customer_orders", getUserOrders);
router.get("/getasingleorder/:id", getASingleOrder);
router.get("/getallUsers", getAllUsers);
router.get("/getmonthwiseorderincome", getMonthWiseOrderIncome);
router.get("/getyearlyorders", getYearlyOrders);
router.get("/getallorders", getAllOrders);
router.put("/update-order-status/:id",updateOrderStatus);
router.get("/get-user-wishlist", getWishlist);
router.get("/:id", getAUser);
router.delete("/delete/:id", deleteAUser);
router.put("/update-user", updateAUser);
router.put("/block-user/:id", blockUser);
router.put("/unblock-user/:id", unBlockUser);

module.exports = router;
