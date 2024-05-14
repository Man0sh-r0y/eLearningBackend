const mongoose = require('mongoose'); // importing mongoose library
const mailSender = require('../utils/mailSender'); // importing mailSender utility

// creating a schema for OTP
const OTPSchema = new mongoose.Schema({
    email: {
        type: String, // defining the data type
        required: true, // defining the constraint
        trim: true, // removes whitespace from both ends of a string
    },
    otp: {
        type: String, // defining the data type
        required: true, // defining the constraint
    },
    createdAt: {
        type: Date, // defining the data type
        required: true, // defining the constraint
        default: Date.now(), // defining the default value
        expires: 5*60 // defining the expiry time to 5 minutes
    }
});

// function to send OTP to the user's email
async function sendVerificationEmail(email, otp) {
    try{
        const mailTitle = "Verification Email";
        const mailBody = `${otp} is your verification code. Don't share it.`;
        
        // Now sending the mail through mailSender utility
        const mailResponse = await mailSender(email, mailTitle, mailBody);

        console.log(`Mail sent successfully: ${mailResponse}`);

    } catch (error) {
        console.log(`Error occured while sending verification email: ${error}`);
        throw error;
    }
}

// pre middileware functions are executed before a request is handled by a route handler
// post middileware functions are executed after a request is handled by a route handler
// here pre middleware function is used that means it will be executed before saving the document in this OTPSchema to the database.
// A OTP should have to be sent to the user's email before signing up to the Website.
// so, sendVerificationEmail() function should be called before saving the document to the database.
// in simple way, we can say that, we have to send verification email before saving the signing up details of the user to the database.
// so, we are using pre middleware function here.

// Mongoose middleware hook
OTPSchema.pre('save', async function(next) {
    await sendVerificationEmail(this.email, this.otp); // sending the verification email
    next();
    // After the asynchronous operation (sending the verification email) is complete, 
    // the next() function is called, 
    // it indicates that the middleware has completed its task, and the save operation can proceed.
});

module.exports = mongoose.model('OTP', OTPSchema); // exporting the model