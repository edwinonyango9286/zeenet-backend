const express = require("express");
const {
  registerUser,
  signInUser,
  getAllUsers,
  getAUser,
  deleteAUser,
  updateAUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  resetUserPasswordToken,
  resetPassword,
  adminSignIn,
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
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/signin", signInUser);
router.post("/admin-signin", adminSignIn);
router.post("/reset-password-token", resetUserPasswordToken);
router.post("/reset-password-admin-token", resetAdminPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/update-password", authMiddleware, updatePassword);
router.post("/cart", authMiddleware, adddProductToCart);
router.get("/getusercart", authMiddleware, getUserCart);
router.post("/addtocart/applycoupon", authMiddleware, applyCoupon);
router.post("/cart/create-order", authMiddleware, createOrder);
router.get("/getmyorders", authMiddleware, getUserOrders);
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
  updateOrderStatus
);
router.get("/refreshAccessToken", handleRefreshToken);
router.put("/logout",logout);
router.get("/get-user-wishlist", authMiddleware, getWishlist);
router.get("/:id", authMiddleware, getAUser);
router.delete("/delete/:id", authMiddleware, deleteAUser);
router.put("/update-user", authMiddleware, updateAUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser);

module.exports = router;
