// Import the app
const app = require("./app");
const dotenv = require("dotenv");
dotenv.config();

// Import and setup CORS
const cors = require("cors");
const origins = [
  process.env.ORIGIN_LOCALHOST_3000,
  process.env.ORIGIN_LOCALHOST_3001,
  process.env.ORIGIN_ZEENET_FRONTSTORE,
  process.env.ORIGIN_ZEENET_ADMINAPP,
];
app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
    headers: ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
    exposedHeaders: ["Content-Type", "Authorization"],
  })
);

// Import and setup error handling
const { notFound, errorHandler } = require("./middlewares/errorHandler");
app.use(notFound);
app.use(errorHandler);

// Connect to the database
const { connect } = require("./config/databaseConnection");
connect();

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
