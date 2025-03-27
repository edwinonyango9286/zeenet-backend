const jwt = require("jsonwebtoken");

const generateAccessToken = (id, role) => {
  try {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "15m" });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { generateAccessToken };
