const express = require("express");
const router = express.Router();
const { stkPush } = require("../controllers/paymentCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/stk-push", authMiddleware, stkPush);

module.exports = router;
