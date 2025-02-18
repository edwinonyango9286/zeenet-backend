const express = require("express");
const {
  getAllUsers,
  getAUser,
  deleteAUser,
  updateAUser,
  blockUser,
  unBlockUser,
  updatePassword,
  resetUserPasswordToken,
  resetPassword,
  getWishlist,
  adddProductToCart,
  getUserCart,
  applyCoupon,
  createOrder,
  getUserOrders,
  getMonthWiseOrderIncome,
  getYearlyOrders,
  getAllOrders,
  getASingleOrder,
  resetAdminPasswordToken,
  updateOrderStatus,
} = require("../controllers/userCtrl");
const {
  authMiddleware,
  isAdmin,
  isBlocked,
} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/reset-password-token", resetUserPasswordToken);
router.post("/reset-password-admin-token", resetAdminPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/update-password", authMiddleware, updatePassword);
router.post("/cart", authMiddleware, adddProductToCart);
router.get("/getusercart", authMiddleware, getUserCart);
router.post("/addtocart/applycoupon", authMiddleware, applyCoupon);
router.post("/cart/create-order", authMiddleware, createOrder);
router.get("/get_customer_orders", authMiddleware, getUserOrders);
router.get("/getasingleorder/:id", authMiddleware, isAdmin, getASingleOrder);
router.get("/getallUsers", authMiddleware, isAdmin, getAllUsers);
router.get(
  "/getmonthwiseorderincome",
  authMiddleware,
  isAdmin,
  getMonthWiseOrderIncome
);
router.get("/getyearlyorders", authMiddleware, isAdmin, getYearlyOrders);
router.get("/getallorders", authMiddleware, isAdmin, getAllOrders);
router.put(
  "/update-order-status/:id",
  authMiddleware,
  isAdmin,
  isBlocked,
  updateOrderStatus
);
router.get("/get-user-wishlist", authMiddleware, isBlocked, getWishlist);
router.get("/:id", authMiddleware, isBlocked, getAUser);
router.delete("/delete/:id", authMiddleware, isBlocked, deleteAUser);
router.put("/update-user", authMiddleware, isBlocked, updateAUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser);

module.exports = router;
