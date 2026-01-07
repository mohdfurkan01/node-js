const cron = require("node-cron");
const mongoose = require("mongoose");

// Runs every 12 hours
cron.schedule("0 */12 * * *", async () => {
  try {
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("MongoDB ping successful");
  } catch (err) {
    console.error("MongoDB ping failed", err.message);
  }
});
