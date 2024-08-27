const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  try {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  } catch (error) {
    throw new Error("Failed to generate token.");
  }
};

module.exports = { generateToken };
