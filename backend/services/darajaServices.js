const axios = require("axios");
const asyncHandler = require("express-async-handler");

const darajaBaseUrl = "https://sandbox.safaricom.co.ke/";

const generateAccessToken = asyncHandler(async () => {
  try {
    const response = await axios.post(
      `${darajaBaseUrl}oauth/v1/generate`,
      {},
      {
        auth: {
          username: process.env.SAFARICOM_API_KEY,
          password: process.env.SAFARICOM_API_SECRET,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    throw new Error(error);
  }
});


const initiateSTKPush = asyncHandler(
  async (phone, amount) => {
    try {
      const accessToken = await generateAccessToken();
      const response = await axios.post(
        `${darajaBaseUrl}mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: process.env.SAFARICOM_SHORTCODE,
          Password: process.env.SAFARICOM_PASSKEY,
          Timestamp: getTimestamp(),
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: phone,
          PartyB: process.env.SAFARICOM_SHORTCODE,
          phone: phone,
          CallBackURL: process.env.STK_CALLBACK_URL,
          AccountReference: accountReference,
          TransactionDesc: transactionDesc,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

const getTimestamp = () => {
  return new Date().toISOString().replace(/[-:]/g, "").slice(0, -3);
};

module.exports = { generateAccessToken, initiateSTKPush };
