const express = require("express");
const {
  createDeliveryStation,
  updateDeliveryStation,
  deleteDeliveryStation,
  getDeliveryStation,
  getallDeliveryStations,
} = require("../controllers/deliveryStationCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, isAdmin, createDeliveryStation);
router.put("/update/:id", authMiddleware, isAdmin, updateDeliveryStation);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteDeliveryStation);
router.get("/get/:id", getDeliveryStation);
router.get("/getallcountries", getallDeliveryStations);

module.exports = router;
