const express = require('express'); // Import express
const router = express.Router(); // Make a router

// Import the controllers
const {createCourse, showAllCourses, getCourseDetails} = require('../controllers/Course');
const {createSection, updateSection, deleteSection} = require('../controllers/CourseContentSection');
const {createSubSection, updateSubSection, deleteSubSection} = require('../controllers/CourseContentSubSection');
const {createCategory, showAllCategories, categoryPageDetails} = require('../controllers/Category');
const {createRatingAndReview, updateRatingAndReview, deleteRatingAndReview, getAverageRating, getAllRatingsAndReviews} = require('../controllers/RatingsAndReviews');
const {auth, isStudent, isInstructor, isAdmin} = require('../middleware/auth');

// define the routes
router.post('/createCourse', auth, isInstructor, createCourse); // Make a route for createCourse
router.get('/showAllCourses', showAllCourses); // Make a route for showAllCourses
router.get('/getCourseDetails', getCourseDetails); // Make a route for getCourseDetails
router.post('/createSection', auth, isInstructor, createSection); // Make a route for createSection
router.post('/updateSection', auth, isInstructor, updateSection); // Make a route for updateSection
router.post('/deleteSection', auth, isInstructor, deleteSection); // Make a route for deleteSection
router.post('/createSubSection', auth, isInstructor, createSubSection); // Make a route for createSubSection
router.post('/updateSubSection', auth, isInstructor, updateSubSection); // Make a route for updateSubSection
router.post('/deleteSubSection', auth, isInstructor, deleteSubSection); // Make a route for deleteSubSection
router.post('/createCategory', auth, isAdmin, createCategory); // Make a route for createCategory
router.get('/showAllCategories', showAllCategories); // Make a route for showAllCategories
router.get('/categoryPageDetails', categoryPageDetails); // Make a route for categoryPageDetails
router.post('/createRatingAndReview', auth, isStudent, createRatingAndReview); // Make a route for createRatingAndReview
router.post('/updateRatingAndReview', auth, isStudent, updateRatingAndReview); // Make a route for updateRatingAndReview
router.post('/deleteRatingAndReview', auth, isStudent, deleteRatingAndReview); // Make a route for deleteRatingAndReview
router.get('/getAverageRating/', getAverageRating); // Make a route for getAverageRating
router.get('/getAllRatingsAndReviews/', getAllRatingsAndReviews); // Make a route for getAllRatingsAndReviews

module.exports = router; // Export the router so we can use it in the server.js file
