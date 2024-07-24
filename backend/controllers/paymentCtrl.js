const asyncHandler = require("express-async-handler")
const { initiateSTKPush } = require("../services/darajaServices");



const checkout = async (req, res) => {
  const { mobile, amount } = req.body;
  try {
    const stkPushResponse = await initiateSTKPush(mobile, amount);
    res.json({ message: "STK Push initiated successfully", stkPushResponse });
  } catch (error) {
    res.status(500).json({
      error: "Failed to initiate STK Push",
      message: error.message,
    });
  }
};
module.exports = {
  checkout,
};
