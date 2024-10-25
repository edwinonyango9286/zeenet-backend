const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {});
    console.log("Database connected.");
  } catch (error) {
    console.log(error.message);
  }
};

const disConnect = async () => {
  try {
    await mongoose.disconnect();
    console.log("Database disconnected.");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { connect, disConnect };
