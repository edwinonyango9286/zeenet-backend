const mongoose = require("mongoose");

const connect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI_TEST);
    console.log(
      `Database connected: ${connect.connection.host} , db: ${connect.connection.name}`
    );
  } catch (error) {
    console.log(error.message);
  }
};

const disConnect = async () => {
  try {
    const disconnect = await mongoose.disconnect();
    console.log(
      `Database disconnected: ${disconnect.connection.host}, db: ${disconnect.connection.name}`
    );
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { connect, disConnect };
