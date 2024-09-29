const axios = require("axios");
const expressAsyncHandler = require("express-async-handler");

let token;

const generateTimestamp = () => {
  const date = new Date();
  return date
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .substring(0, 14);
};

const generatePassword = (shortCode, passkey, timestamp) => {
  return Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64");
};

const getToken = expressAsyncHandler(async () => {
  try {
    if (!token) {
      const response = await axios.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`
            ).toString("base64")}`,
          },
        }
      );
      token = response.data.access_token;

      setTimeout(() => {
        token = null;
      }, 3600000);
    }
    return token;
  } catch (error) {
    throw new Error("Failed to retrieve token");
  }
});

const stkPush = expressAsyncHandler(async (req, res) => {
  const { phone, amount } = req.body;
  const formattedPhone = phone.startsWith("254")
    ? phone
    : `254${phone.slice(1)}`;

  try {
    if (!token) {
      token = await getToken();
    }

    const timestamp = generateTimestamp();
    const password = generatePassword(
      process.env.SHORTCODE,
      process.env.PASSKEY,
      timestamp
    );

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: process.env.SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.CALLBACKURL,
        AccountReference: "Test",
        TransactionDesc: "Test",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { stkPush };
