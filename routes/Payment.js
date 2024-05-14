const express = require('express'); // Import express
const router = express.Router(); // Make a router

// Import the controller
const {capturePayment, verifySignature} = require('../controllers/Payment');
const {auth, isStudent} = require('../middleware/auth');

// define the routes
router.post('/capturePayment', auth, isStudent, capturePayment); // Make a route for capturePayment
router.post('/verifySignature', verifySignature); // Make a route for verifySignature

module.exports = router; // Export the router so we can use it in the server.js file


