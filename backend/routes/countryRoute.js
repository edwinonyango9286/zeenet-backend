const express = require("express");

const {
  createCountry,
  updateCountry,
  deleteCountry,
  getCountry,
  getallCountries,
} = require("../controllers/countryCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, isAdmin,createCountry);
router.put("/update/:id", authMiddleware, isAdmin, updateCountry);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteCountry);
router.get("/get/:id", getCountry);
router.get("/getallcountries", getallCountries);

module.exports = router;
