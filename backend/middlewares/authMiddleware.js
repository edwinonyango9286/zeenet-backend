const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      if (!token) {
        throw new Error("Please login to proceed.");
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded?.id);
      req.user = user;
      next();
    }
  } catch (error) {
    throw new Error(error);
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
