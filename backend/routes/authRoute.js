const express = require("express");
const {
  registerUser,
  signInUser,
  registerAdmin,
  signInAdmin,
  refreshAccessToken,
  logout,
} = require("../controllers/authCtrl");
const router = express.Router();

router.post("/customer_register", registerUser);
router.post("/signin_customer", signInUser);
router.post("/admin_register", registerAdmin);
router.post("/admin_signin", signInAdmin);
router.get("/refreshAccessToken", refreshAccessToken);
router.put("/logout", logout);

module.exports = router;
