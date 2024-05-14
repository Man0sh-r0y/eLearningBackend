const mongoose = require('mongoose'); // importing mongoose library

// A User can be a Student, Instructor or Admin
// A User can have many Courses
// A User can have many CourseProgresses (one for each course)
// A User can have one Profile, image, email, password, firstName and lastName
// A User can have one AccountType [Admin or Student or Instructor]
// A User can have one AdditionalDetails (additional details in profile like phone no, DOB, etc.)

// creating a schema
const userSchema = new mongoose.Schema({
    firstName: { 
        type: String, // defining the data type
        required: true, // defining the constraint
        trim: true, // removes whitespace from both ends of a string
    }, 
    lastName: {
        type: String, // defining the data type
        required: true, // defining the constraint
        trim: true, // removes whitespace from both ends of a string
    },
    email: {
        type: String, // defining the data type
        required: true, // defining the constraint
        trim: true, // removes whitespace from both ends of a string
    },
    password: {
        type: String, // defining the data type
        required: true, // defining the constraint
    },
    accountType:{
        type: String, // defining the data type
        required: true, // defining the constraint
        enum: ['Admin', "Student", "Instructor"], // defining the constraint
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId, // defining the data type
        required: true, // defining the constraint
        ref: 'Profile', // defining the reference
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId, // defining the data type
        ref: 'Course', // defining the reference
    }], // array of courses
    image:{
        type: String, // defining the data type (img url should be in string format)
        required: true, // defining the constraint
    },
    courseProgress: [{
        type: mongoose.Schema.Types.ObjectId, // defining the data type
        ref: 'CourseProgress', // defining the reference
    }], // array of course progresses
    scheduleDelete: {
        type: Boolean,
        default: false
    }
    
});

module.exports = mongoose.model('User', userSchema); // exporting the model