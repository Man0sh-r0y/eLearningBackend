const express = require('express'); // Import express
const router = express.Router(); // Make a router

// Import the controllers
const {sendOTP, signUp, login, changePassword} = require('../controllers/Auth');
const {generateForgotPasswordToken, resetForgotPassword} = require('../controllers/ForgetPassword');
const {auth} = require('../middleware/auth');

// define the routes
router.post('/sendotp', sendOTP); // Make a route for sendOTP
router.post('/signup', signUp); // Make a route for signUp
router.post('/login', login); // Make a route for login
router.post('/changePassword', auth, changePassword); // Make a route for changePassword
router.post('/forgotPasswordToken', generateForgotPasswordToken); // Make a route for generateForgotPasswordToken
router.post('/resetForgotPassword', resetForgotPassword); // Make a route for resetForgotPassword

module.exports = router; // Export router
