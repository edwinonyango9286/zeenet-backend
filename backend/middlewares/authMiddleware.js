const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { refreshAccessToken } = require("../controllers/authCtrl");

const verifyUserToken = asyncHandler(async (req, res, next) => {
  try {
    let accessToken;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
      accessToken = req.headers.authorization.split(" ")[1];
      if (!accessToken) {
        throw new Error("Access token is missing. Please login to proceed.");
      }
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      const user = await User.findById(decoded?.id);
      if (!user) {
        throw new Error("Invalid access token. Please login to proceed.");
      }
      req.user = user;
      next();
    }
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      try {
        const newAccessToken = await refreshAccessToken(req, res);
        req.headers.authorization = `Bearer ${newAccessToken}`;
        next();
      } catch (error) {
        throw new Error(
          "Failed to refresh access token. Please login to proceed."
        );
      }
    } else {
      throw new Error("Internal server error. Please try again in a moment.");
    }
  }
});

module.exports = { verifyUserToken, };
