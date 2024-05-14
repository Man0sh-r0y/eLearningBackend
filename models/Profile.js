const mongoose = require('mongoose'); // importing mongoose library

// A User's Profile can have gender, dateOfBirth, about and contactNumber details

// creating a schema for profile
const profileSchema = new mongoose.Schema({
    gender: {
        type: String, // defining the data 
        trim: true, // removes whitespace from both ends of a string
    },
    dateOfBirth: {
        type: Date, // defining the data type
        trim: true, // removes whitespace from both ends of a string
    },
    about: {
        type: String, // defining the data type
        trim: true, // removes whitespace from both ends of a string
    },
    contactNumber: {
        type: String, // defining the data type
        trim: true, // removes whitespace from both ends of a string
    }
});

module.exports = mongoose.model('Profile', profileSchema); // exporting the model