
const mongoose = require("mongoose");
require("dotenv").config();
const URL = process.env.URL;

mongoose
  .connect(URL)
  .then(() => {
    console.log("User database connected");
  })
  .catch((e) => {
    console.log("User database connection error", e);
  });

  const dashboardDataSchema = new mongoose.Schema(
    {
      location: {
        city: String,
        state: String,
        pincode: String,
      },
      schemeName: String,
      statistics: {
        totalPopulation: Number,
        trafficGenerated: Number,
        totalAccountsOpened: Number,
        totalFundsDeposited: Number,
      },
      registrationsOverYears: [
        {
          year: Number,
          registrations: Number,
        },
      ],
      lastUpdated: Date,
    },
    { collection: 'dashboard_data' } // Explicitly specify the collection name
  );
  
  // Create the Mongoose model
  const DashboardData = mongoose.model('DashboardData', dashboardDataSchema);
  module.exports = DashboardData;