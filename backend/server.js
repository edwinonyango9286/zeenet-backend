// Import the app
const app = require("./app");
const dotenv = require("dotenv")
dotenv.config();
const { runTheJobs } = require("./crons/index");

// Import and setup error handling
const { notFound, errorHandler } = require("./middlewares/errorHandler");
app.use(notFound);
app.use(errorHandler);

// run cron jobs
const isCronJobsEnabled = process.env.APP_ENABLE_CRON_JOBS || true;
if (String(isCronJobsEnabled).toLowerCase() === true) {
  runTheJobs();
}

// Connect to the database
const { connect } = require("./config/dbConnect");
connect();

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
