const express = require("express");
const {addAColor,getAllColors,getAColorByIdUsers,getAColorByIdAdmin,} = require("../controllers/colorCtrl");

const router = express.Router();
router.post("/create",addAColor);
router.get("/colors", getAllColors);
router.get("/color/admin/:colorId",getAColorByIdAdmin);
router.get("/color/:colorId", getAColorByIdUsers);

module.exports = router;
