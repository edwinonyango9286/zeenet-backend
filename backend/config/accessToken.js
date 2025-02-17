const jwt = require("jsonwebtoken");

const generateAccessToken = (id) => {
  try {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { generateAccessToken };
