const express = require("express");
const {
  addAColor,
  getAllColors,
  getAColorByIdUsers,
  getAColorByIdAdmin,
} = require("../controllers/colorCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();
router.post("/create", authMiddleware, isAdmin, addAColor);
router.get("/colors", getAllColors);
router.get(
  "/color/admin/:colorId",
  authMiddleware,
  isAdmin,
  getAColorByIdAdmin
);
router.get("/color/:colorId", getAColorByIdUsers);

module.exports = router;
