const express = require("express");
const {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getanEnquiry,
  getAllEquiries,
} = require("../controllers/enqCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create", createEnquiry);
router.put("/update/:id", authMiddleware, isAdmin, updateEnquiry);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteEnquiry);
router.get("/get/:id", getanEnquiry);
router.get("/getall", getAllEquiries);

module.exports = router;
