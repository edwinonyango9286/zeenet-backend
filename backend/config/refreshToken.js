const jwt = require("jsonwebtoken");

const generateRefreshToken = (id, role) => {
  try {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "3d" });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { generateRefreshToken };
