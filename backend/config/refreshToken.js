const jwt = require("jsonwebtoken");

const generateRefreshToken = (id) => {
  try {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
  } catch (error) {
    throw new Error("Failed to generate refresh token.");
  }
};

module.exports = { generateRefreshToken };
