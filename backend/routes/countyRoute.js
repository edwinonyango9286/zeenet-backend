const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createCounty,
  updateCounty,
  deleteCounty,
  getCounty,
  getallCounties,
} = require("../controllers/countyCtrl");

const router = express.Router();

router.post("/create", authMiddleware, isAdmin, createCounty);
router.put("/update/:id", authMiddleware, isAdmin, updateCounty);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteCounty);
router.get("/get/:id", getCounty);
router.get("/getallcounties", getallCounties);

module.exports = router;
