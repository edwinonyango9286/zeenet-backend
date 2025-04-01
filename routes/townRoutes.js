const express = require("express");
const {createTown,updateTown,deleteTown,getTown,getallTowns,} = require("../controllers/townCtrl");

const router = express.Router();

router.post("/create",createTown);
router.put("/update/:id",updateTown);
router.delete("/delete/:id",deleteTown);
router.get("/get/:id", getTown);
router.get("/getalltowns", getallTowns);

module.exports = router;
