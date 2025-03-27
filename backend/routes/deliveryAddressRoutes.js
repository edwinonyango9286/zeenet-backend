const express = require("express");

const {addDeliveryAddress,updateDeliveryAddress,deleteDeliveryAddress,getAllDeliveryAddresses,getUserDeliveryAddresses,} = require("../controllers/deliveryAddressCtrl");
const router = express.Router();

router.post("/create",addDeliveryAddress);
router.put("/update/:id",updateDeliveryAddress);
router.delete("/delete/:id",deleteDeliveryAddress);
router.get("/getuserdeliveryaddresses",getUserDeliveryAddresses);
router.get("/getalldeliveryaddresses",getAllDeliveryAddresses);

module.exports = router;
