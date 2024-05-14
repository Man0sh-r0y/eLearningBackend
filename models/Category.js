const mongoose = require('mongoose');  // importing mongoose library

// In the homepage there will be a catalog of course (Categories)
// there will be listed course names
// If you click on any Category, you will go to another page
// each Category will have its name, description and courses which are related to that category
// suppose a  Category is 'web development'. If you click on the category you will see it will have its name and description and courses which are related to web development

// creating a schema for course categories
const categorySchema = new mongoose.Schema({
    name: {
        type: String, // defining the data type
        required: true, // defining the constraint
        trim: true, // removes whitespace from both ends of a string
    },
    description: {
        type: String, // defining the data type
        required: true, // defining the constraint
        trim: true, // removes whitespace from both ends of a string
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId, // defining the data type
        required: true, // defining the constraint
        ref: 'Course' // referencing the Course model
    }] // array of courses as a tag can have multiple courses
});

module.exports = mongoose.model('Category', categorySchema); // exporting the model