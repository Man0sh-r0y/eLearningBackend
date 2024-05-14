const express = require('express'); // Import express
const router = express.Router(); // Make a router

// Import the controllers
const {contactUs} = require('../controllers/ContactUs');

router.post('/contactUs', contactUs); // Make a route for contactUs

module.exports = router; // Export router