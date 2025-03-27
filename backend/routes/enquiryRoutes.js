const express = require("express");
const {createAnEnquiry,updateAnEnquiryStatus,deleteAnEnquiry,getAnEnquiry,getAllEquiries} = require("../controllers/enquiryCtrl");
const router = express.Router();

router.post("/create", createAnEnquiry);
router.put("/update_status/:id",updateAnEnquiryStatus);
router.delete("/delete/:id",deleteAnEnquiry);
router.get("/get_enquiry/:id", getAnEnquiry);
router.get("/get_all_enquiries",getAllEquiries);

module.exports = router;
