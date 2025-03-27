const express = require("express");
const {
  createDeliveryStation,
  updateDeliveryStation,
  deleteDeliveryStation,
  getDeliveryStation,
  getallDeliveryStations,
} = require("../controllers/deliveryStationCtrl");

const router = express.Router();

router.post("/create",createDeliveryStation);
router.put("/update/:id",updateDeliveryStation);
router.delete("/delete/:id",deleteDeliveryStation);
router.get("/get/:id", getDeliveryStation);
router.get("/getalldeliverystations", getallDeliveryStations);

module.exports = router;
