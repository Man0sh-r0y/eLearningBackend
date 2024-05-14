const mongoose = require('mongoose');// importing mongoose library

// for each course, there will be a course progress bar in the student's account
// it will have the corresponding courseID and the completed videos of that course
// completed videos means the videos that the student has watched  

// creating a schema for course progress
const courseProgressSchema = new mongoose.Schema({
    courseID: {
        type: mongoose.Schema.Types.ObjectId, // defining the data type
        required: true, // defining the constraint
        ref: 'Course' // referencing the Course model
    },
    completedVideos: [{
        type: mongoose.Schema.Types.ObjectId, // defining the data type
        required: true, // defining the constraint
        ref: 'CourseContentSubSection' // referencing the CourseContentSubSection model
    }]
});

module.exports = mongoose.model('CourseProgress', courseProgressSchema); // exporting the model