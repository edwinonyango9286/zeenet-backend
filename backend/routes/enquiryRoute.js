const express = require("express");
const {
  createAnEnquiry,
  updateAnEnquiryStatus,
  deleteAnEnquiry,
  getAnEnquiry,
  getAllEquiries,
} = require("../controllers/enquiryCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create", createAnEnquiry);
router.put(
  "/update_status/:id",
  authMiddleware,
  isAdmin,
  updateAnEnquiryStatus
);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteAnEnquiry);
// not working with authmiddleware and isAdmin middware
router.get("/get_enquiry/:id", getAnEnquiry);
router.get("/get_all_enquiries", authMiddleware, isAdmin, getAllEquiries);

module.exports = router;
