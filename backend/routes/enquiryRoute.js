const express = require("express");
const {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getAnEnquiry,
  getAllEquiries,
} = require("../controllers/enquiryCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create", createEnquiry);
router.put("/update/:id", authMiddleware, isAdmin, updateEnquiry);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteEnquiry);
router.get("/get/:id", authMiddleware, isAdmin, getAnEnquiry);
router.get("/getall", authMiddleware, isAdmin, getAllEquiries);

module.exports = router;
