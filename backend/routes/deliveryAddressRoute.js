const express = require("express");

const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
  createDeliveryAddress,
  updateDeliveryAddress,
  deleteDeliveryAddress,
  getAllDeliveryAddresses,
  getDeliveryAddress,
} = require("../controllers/deliveryAddressCtrl");

const router = express.Router();

router.post("/create", authMiddleware, createDeliveryAddress);
router.put("/update/:id", authMiddleware, updateDeliveryAddress);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteDeliveryAddress);
router.get("/get/:id", authMiddleware, getDeliveryAddress);
router.get(
  "/getalldeliveryaddresses",
  authMiddleware,
  isAdmin,
  getAllDeliveryAddresses
);

module.exports = router;
