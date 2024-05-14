const RatingAndReview = require('../models/RatingAndReview'); // importing the model
const Course = require('../models/Course'); // importing the model
const User = require('../models/User'); // importing the model
const { mongo, default: mongoose } = require("mongoose");

// Create a rating and review
exports.createRatingAndReview = async (req, res) => {

    try {
        // Getting the rating and review from the request body
        const { rating, review, courseId} = req.body; 
        // Getting the userId from the req.user object
        const userId = req.user.id;

        const course = await Course.findById(courseId); // finding the course by the courseId

        // check if Students is enrolled to the course
        const isStudentEnrolled = course?.studentEnrolled.forEach(studentId => {
            if (studentId === new mongoose.Types.ObjectId(userId)) { // User id can be in String format, so we need to convert it to ObjectId
                return true;
            }
        });

        if(!isStudentEnrolled) {
            return res.status(400).json({
                success: false,
                message: 'Student is not enrolled to the course'
            })
        }

        // Check if User already rated and reviewed the course
        const alreadyRatedAndReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId
        });

        if(alreadyRatedAndReviewed) {
            return res.status(400).json({
                success: false,
                message: 'Student already rated and reviewed the course'
            })
        }

        // Create a new rating and review
        const newRatingAndReview = new RatingAndReview.create({
            rating: rating,
            review: review,
            user: userId,
            course: courseId
        });

        // Update the course ratings and reviews
        course.ratingsAndReviews.push(newRatingAndReview._id);

        return res.status(200).json({
            success: true,
            message: `Rating and Review created successfully in the course ${course.courseName}`
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error occurred while creating the rating and review'
        });
    }
}

// Update a rating and review
exports.updateRatingAndReview = async (req, res) => {

    try {
        // Fetch the rating and review id from the request params
        const {rating, review, courseId} = req.body;

        // Get the user id
        const userId = req.user.id;
        const user = await User.findById(userId); // finding the user by the userId

        const course = await Course.findById(courseId); // finding the course by the courseId
        if(!course) {
            return res.status(400).json({
                success: false,
                message: 'Course does not exist'
            });
        }

        // Find the rating and review by the id
        const ratingAndReview = await RatingAndReview.findOne({
            user: userId,
            course: courseId
        });

        // Validate the rating and review
        if(!ratingAndReview) {
            return res.status(400).json({
                success: false,
                message: 'Rating and Review created by the user does not exist'
            });
        }

        // Check if the user is the owner of the rating and review
        if(ratingAndReview.user !== new mongoose.Types.ObjectId(userId)) { // userId is in String format and ratingAndReview.user is in ObjectId format
            return res.status(401).json({
                success: false,
                message: `User ${user.firstName} ${user.lastName} is not authorized to delete the rating and review`
            });
        }

        // Check if the rating exists
        if(rating) {
            ratingAndReview.rating = rating;
        }
        // Check if the review exists
        if(review) {
            ratingAndReview.review = review;
        }

        // Save the rating and review
        await ratingAndReview.save();

        return res.status(200).json({
            success: true,
            message: `Rating and Review updated successfully for the course ${course.courseName}`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error occurred while updating the rating and review created by the user'
        });
    }
}

// Delete a rating and review
exports.deleteRatingAndReview = async (req, res) => {

    try {
        
        // Fetch the rating and review id from the request body
        const {ratingAndReviewId} = req.body;

        // Get the user id
        const userId = req.user.id;
        const user = await User.findById(userId); // finding the user by the userId

        // Find the rating and review by the id
        const ratingAndReview = await RatingAndReview.findById(ratingAndReviewId);

        // Validate the rating and review
        if(!ratingAndReview) {
            return res.status(400).json({
                success: false,
                message: `Rating and Review created by the user ${user.firstName} ${user.lastName} does not exist`
            });
        }

        // Check if the user is the owner of the rating and review
        if(ratingAndReview.user !== new mongoose.Types.ObjectId(userId)) { // userId is in String format and ratingAndReview.user is in ObjectId format
            return res.status(401).json({
                success: false,
                message: `User ${user.firstName} ${user.lastName} is not authorized to delete the rating and review`
            });
        }

        // Delete the rating and review
        await ratingAndReview.remove();

        return res.status(200).json({
            success: true,
            message: `Rating and Review created by the user ${user.firstName} ${user.lastName} deleted successfully`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error occurred while deleting the rating and review created by the user'
        });
    }
}

// Get average rating and review of a course
exports.getAverageRating = async (req, res) => {

    try {
        // Fetch the course id from the request params
        const {courseId} = req.params;

        // Find the course by the id
        const course = await Course.findById(courseId);

        // Validate the course
        if(!course) {
            return res.status(400).json({
                success: false,
                message: 'Course does not exist'
            });
        }

        // Get the average rating 
        const averageRating = await RatingAndReview.aggregate([ // aggregate method is used to perform operations on the data
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId) // courseId is in String format but it's stored in ObjectId format in the database
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                }
            }
        ]);
        // The `aggregate` method is part of MongoDB's Aggregation Framework, allowing for complex data transformation and analysis.
        // `$match` operator filters documents based on a specified condition
        // `$group` operator groups the documents that passed through the $match stage. 
        // The $group stage separates documents into groups according to a "group key"
        // Use the _id field in the $group pipeline stage to set the group key
        // The output is one document for each unique group key.
        // In this case here, it groups all of found matches into a single group as _id is null 
        // Here, The result is an array containing a single document with the calculated averageRating: [{ _id: null, averageRating: 4.5 }]

        if(averageRating.length > 0) {
            return res.status(200).json({
                success: true,
                message: `Average rating of the course ${course.courseName} fetched successfully`,
                averageRating: averageRating[0].averageRating
            });
        }

        // If there are no ratings and reviews for the course, then return 0
        return res.status(200).json({
            success: true,
            message: `No ratings and reviews for the course ${course.courseName}`,
            averageRating: 0
        });

        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error occurred while fetching the average rating of the course',
            error: error.message
        });
    }
}

// Get all ratings and reviews of a course
exports.getAllRatingsAndReviews = async (req, res) => {

    try {
        // Get all the ratings and reviews
        const ratingsAndReviews = await RatingAndReview.find({}).sort({
            rating: -1 // sort in descending order
        }).populate({
            path: 'user', // populate the user field
            select: 'firstName lastName email image' // select the firstName, lastName, email and image fields
        }).populate({
            path: 'course', // populate the course field
            select: 'courseName' // select the courseName field
        }).exec(); // execute the query
        // Here select field specifies which fields to include from the related document.

        return res.status(200).json({
            success: true,
            message: 'All ratings and reviews fetched successfully',
            ratingsAndReviews: ratingsAndReviews
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error occurred while fetching all the ratings and reviews',
            error: error.message
        });
    }
}