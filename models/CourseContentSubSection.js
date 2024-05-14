const mongoose = require('mongoose'); // importing mongoose library

// In the course content part, there will be multiple sections
// and each section will have multiple subsections
// each sub section will have its title, time duration, description and course video url

// creating a schema for course content sub-section
const subSectionSchema = new mongoose.Schema({
    title: {
        type: String, // defining the data type
        required: true, // defining the constraint
        trim: true, // removes whitespace from both ends of a string
    },
    timeDuration: {
        type: String, // defining the data type
        required: true, // defining the constraint
        trim: true, // removes whitespace from both ends of a string
    },
    description: {
        type: String, // defining the data type
        required: true, // defining the constraint
        trim: true, // removes whitespace from both ends of a string
    },
    videoUrl: {
        type: String, // defining the data type (url should be in string format)
        required: true, // defining the constraint
        trim: true, // removes whitespace from both ends of a string
    }
});

module.exports = mongoose.model('CourseContentSubSection', subSectionSchema); // exporting the model