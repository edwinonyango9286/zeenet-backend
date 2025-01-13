const express = require("express");

const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
  addDeliveryAddress,
  updateDeliveryAddress,
  deleteDeliveryAddress,
  getAllDeliveryAddresses,
  getUserDeliveryAddresses,
} = require("../controllers/deliveryAddressCtrl");

const router = express.Router();

router.post("/create", authMiddleware, addDeliveryAddress);
router.put("/update/:id", authMiddleware, updateDeliveryAddress);
router.delete("/delete/:id", authMiddleware, deleteDeliveryAddress);
router.get(
  "/getuserdeliveryaddresses",
  authMiddleware,
  getUserDeliveryAddresses
);
router.get(
  "/getalldeliveryaddresses",
  authMiddleware,
  isAdmin,
  getAllDeliveryAddresses
);

module.exports = router;
