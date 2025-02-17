const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { handleRefreshToken } = require("../controllers/userCtrl");

const authMiddleware = asyncHandler(async (req, res, next) => {
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
        const newAccessToken = await handleRefreshToken(req, res);
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

const isAdmin = asyncHandler(async (req, res, next) => {
  try {
    const { email } = req.user;
    if (!email) {
      throw new Error("User does not have an email.");
    }
    const adminUser = await User.findOne({ email });
    if (!adminUser) {
      throw new Error("User not found.");
    }
    if (adminUser.role !== "admin") {
      throw new Error("Not authorised.");
    } else {
      next();
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { authMiddleware, isAdmin };
