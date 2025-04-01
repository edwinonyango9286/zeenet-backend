const express = require("express");

const {createCountry,updateCountry,deleteCountry,getCountry,getallCountries,} = require("../controllers/countryCtrl");
const router = express.Router();

router.post("/create",createCountry);
router.put("/update/:id",updateCountry);
router.delete("/delete/:id",deleteCountry);
router.get("/get/:id", getCountry);
router.get("/getallcountries", getallCountries);

module.exports = router;
