// Import the app
const app = require("./app");
const dotenv = require("dotenv");
dotenv.config();

// Import and setup error handling
const { notFound, errorHandler } = require("./middlewares/errorHandler");
app.use(notFound);
app.use(errorHandler);

// Connect to the database
const { connect } = require("./config/databaseConnection");
connect();

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
