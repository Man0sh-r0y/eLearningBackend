const mongoose = require('mongoose'); // importing mongoose library

// In the course content part, there will be multiple sections 
// and each section will have multiple subsections

// creating a schema for course content section
const sectionSchema = new mongoose.Schema({
    sectionName: {
        type: String, // defining the data type
        required: true, // defining the constraint
        trim: true, // removes whitespace from both ends of a string
    },
    subSection: [{
        type: mongoose.Schema.Types.ObjectId, // defining the data type
        ref: 'CourseContentSubSection' // referencing the SubSection model
    }]
});

module.exports = mongoose.model('CourseContentSection', sectionSchema); // exporting the model