const express = require("express");
const {createCounty,updateCounty,deleteCounty,getCounty,getallCounties,} = require("../controllers/countyCtrl");

const router = express.Router();

router.post("/create",createCounty);
router.put("/update/:id",updateCounty);
router.delete("/delete/:id",deleteCounty);
router.get("/get/:id", getCounty);
router.get("/getallcounties", getallCounties);

module.exports = router;
