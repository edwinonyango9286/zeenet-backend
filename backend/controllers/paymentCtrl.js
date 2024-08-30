const expressAsyncHandler = require("express-async-handler");
const { initiateSTKPush } = require("../services/darajaServices");

const checkout = expressAsyncHandler(async (req, res) => {
  const { mobile, amount } = req.body;
  const stkPushResponse = await initiateSTKPush(mobile, amount);
  res.json({ message: "STK Push initiated successfully", stkPushResponse });
});

module.exports = {
  checkout,
};
