
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

const Schema = mongoose.Schema;

// Define the Feedback schema
const feedbackSchema = new Schema({
  location: {
    type: String,  // Location where the feedback was given
    required: true
  },
  scheme: {
    type: String,  // Name or ID of the scheme the feedback is related to
    required: true
  },
  relevant: {
    type: Boolean,  // Flag to indicate if the feedback is relevant or not
    default: false
  },
  point: {
    type: String,  // Extracted key point or conclusion from the feedback, if relevant
    default: ""  // Empty if no relevant point found
  },
  createdAt: {
    type: Date,  // Timestamp of when the feedback was created
    default: Date.now
  }
});

// Create the Feedback model
const FeedbackModel = mongoose.model('Feedback', feedbackSchema);

module.exports = FeedbackModel;
