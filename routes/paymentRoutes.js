const express = require("express");
const router = express.Router();
const { stkPush } = require("../controllers/paymentCtrl");

router.post("/stk-push",stkPush);

module.exports = router;
