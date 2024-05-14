const mongoose = require('mongoose'); // importing mongoose library

// In the rating and review part, there will be multiple ratings and reviews which are given by the users
// each ratingAndReview will have its user, number of ratings in that course (5 star, 4 start,...etc) and review of that course (given by the user)

const ratingAndReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // defining the data type
        required: true, // defining the constraint
        ref: 'User' // referencing the User model
    },
    rating: {
        type: Number, // defining the data type
        required: true, // defining the constraint
    },
    review: {
        type: String, // defining the data type
        required: true, // defining the constraint
    },
    course: {
        type: mongoose.Schema.Types.ObjectId, // defining the data type
        required: true, // defining the constraint
        ref: 'Course' // referencing the Course model
    }
});

module.exports = mongoose.model('RatingAndReview', ratingAndReviewSchema); // exporting the model