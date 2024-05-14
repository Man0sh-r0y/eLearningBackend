const Razorpay = require('razorpay'); // Importing razorpay module
require('dotenv').config(); // Importing dotenv module to access environment variables

// Instantiate Razorpay with our razorpay key_id and key_secret
var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
  });

module.exports = instance; // Exporting the instance to be used in other files