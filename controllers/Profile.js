const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const schedule = require('node-schedule');
const {uploadMediaToCloudinary} = require('../utils/mediaUploader');
require('dotenv').config(); 

// UPDATE PROFILE:
// 1. Fetch data from request body
// 2. Validate the data wheather all required fields are present or not
// 3. Find the profile 
// 4. Update the profile
// 5. Return the response

// Update the profile
exports.updateProfile = async (req, res) => {

    try {
        //get data from request body
        const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

        // get userId from req.user as we have set the user id in req.user.id while authenticating the user in auth.js middleware
        const id = req.user.id;

        // validation check
        if (!contactNumber || !gender) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        //find the user's profile through user's id
        const userDetails = await User.findById(id);

        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const profileId = userDetails.additionalDetails; // additionalDetails is the id of profile of that user
        const profileDetails = await Profile.findById(profileId);

        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();

        //return response
        return res.status(200).json({
            success: true,
            message: `Profile of User ${userDetails.firstName} ${userDetails.lastName} has been Updated Successfully`,
            profileDetails: profileDetails
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Profile cannot be updated",
            error: error.message
        });
    }
};

// DELETE ACCOUNT
// 1. Fetch data from request body
// 2. Validate the data wheather all required fields are present or not
// 3. Find the user
// 4. Unenroll the user from all the courses
// 5. Delete the profile
// 6. Delete the user
// 7. Schedule the deletion of the user
// 8. Return the response

// Delete the account
exports.deleteAccount = async (req, res) => {

    try {
        //get id from req.user
        const id = req.user.id;
        
        // Fetch the user details
        const userDetails = await User.findById(id);

        // check if the user exists or not
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Schedule the deletion of User
        const deleteOnDate = new Date() + 5 * 24 * 60 * 60 * 1000; // delete after 5 days from now
        userDetails.scheduleDelete = true;
        await userDetails.save();

        schedule.scheduleJob(deleteOnDate, async function () {
            try {
                if (userDetails.scheduleDelete) {
                    // unenroll user from all the courses
                    const courses = userDetails.courses; // get the courses array from user details
                    for (let i = 0; i < courses.length; i++) {
                        const courseID = courses[i]; // get the course id
                        await Course.findByIdAndUpdate(courseID, {
                            $pull: {
                                studentEnrolled: id // remove the user from studentEnrolled array of that course
                            }
                        });
                    }
                    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails }); // delete the profile
                    await User.findByIdAndDelete({ _id: id }); // delete the user
                    console.log(`User ${userDetails.firstName} ${userDetails.lastName} Deleted successfully`);
                }
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: "User cannot be deleted as Problem Occured while scheduling the deletion of user",
                    error: error.message
                });
            }
        });


        //return response
        return res.status(200).json({
            success: true,
            message: `User account of ${userDetails.firstName} ${userDetails.lastName} will be deleted after 5 Days`,
            userDetails: userDetails
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User cannot be deleted",
            error: error.message
        });
    }
};

// Cancel the deletion of account
exports.cancelDeleteAccount = async (req, res) => {

    try {
        //get id from req.user
        const id = req.user.id;

        // Fetch the user details
        const userDetails = await User.findById(id);

        // check if the user exists or not
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!userDetails.scheduleDelete) {
            return res.status(400).json({
                success: false,
                message: `User account of ${userDetails.firstName} ${userDetails.lastName} is not scheduled for deletion`
            });
        }

        // cancel the deletion of user
        userDetails.scheduleDelete = false;
        await userDetails.save();

        //return response
        return res.status(200).json({
            success: true,
            message: `User account of ${userDetails.firstName} ${userDetails.lastName} recovery initiated`,
            userDetails: userDetails
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User account cannot be deleted",
            error: error.message
        });
    }
};

// Get all details of User
exports.getAllDetailsOfUser = async (req, res) => {

    try {
        //get id from req.user
        const id = req.user.id;

        //validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        //return response
        return res.status(200).json({
            success: true,
            message: "User Data Fetched Successfully",
            userDetails: userDetails
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User details can't be fetched",
            error: error.message
        });
    }
};

// Update Display Picture of User Profile
exports.updateDisplayPicture = async (req, res) => {

    try {
        // Get the display picture from req.files
        const { displayPicture } = req.files;

        // Get the user id from req.user
        const userId = req.user.id;
        const user = await User.findById(userId); // Find the user

        // Validate the data
        if (!displayPicture) {
            return res.status(400).json({
                success: false,
                message: "Display Picture is required"
            });
        }

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // upload the display picture to cloudinary
        const uploadedImage = await uploadMediaToCloudinary(displayPicture, process.env.CLOUDINARY_FOLDER_NAME, 1000, 1000);

        // update the display picture
        user.image = uploadedImage.secure_url;
        await user.save();

        return res.status(200).json({
            success: true,
            message: `Display Picture of ${user.firstName} ${user.lastName} Updated Successfully`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Display Picture of the user cannot be updated",
            error: error.message
        });
    }
}

// Get enrolled courses of the Student
exports.getEnrolledCourses = async (req, res) => {

    try {
        const userId = req.user.id; // get the user id from req.user
        const user = await User.findById(userId).populate("courses").exec(); // find the user and populate the courses array

        // Validate the data
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // return the response
        return res.status(200).json({
            success: true,
            message: `Enrolled Courses by the Student ${user.firstName} ${user.lastName} Fetched Successfully`,
            courses: user.courses
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Enrolled Courses of the Student cannot be fetched",
            error: error.message
        });
    }
}
