const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createTown,
  updateTown,
  deleteTown,
  getTown,
  getallTowns,
} = require("../controllers/townCtrl");

const router = express.Router();

router.post("/create", authMiddleware, isAdmin, createTown);
router.put("/update/:id", authMiddleware, isAdmin, updateTown);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteTown);
router.get("/get/:id", getTown);
router.get("/getalltowns/:id", getallTowns);

module.exports = router;
