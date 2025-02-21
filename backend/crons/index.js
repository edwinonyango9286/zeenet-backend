const cron = require("node-cron");
const {
  EVERY_DAY_AT_6AM,
  EVERY_DAY_AT_8PM,
} = require("./cronScheduleConstants");
const expressAsyncHandler = require("express-async-handler");
const { checkStockLevelCron } = require("./checkStockLevelCron");

const runTheJobs = expressAsyncHandler(async (req, res) => {
  cron.schedule(EVERY_DAY_AT_6AM, async () => {
    try {
      await checkStockLevelCron();
    } catch (error) {
      throw new Error(error);
    }
  });
  cron.schedule(EVERY_DAY_AT_8PM, async (req, res) => {
    try {
      await checkStockLevelCron();
    } catch (error) {
      throw new Error(error);
    }
  });
});


module.exports ={ runTheJobs}

