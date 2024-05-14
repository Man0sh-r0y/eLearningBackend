const CourseContentSubSection = require("../models/CourseContentSubSection");
const CourseContentSection = require("../models/CourseContentSection");
const { uploadMediaToCloudinary } = require("../utils/mediaUploader");
require('dotenv').config(); 

// CREATE THE COURSE CONTENT SUBSECTION
// 1. Fetch data from Req body
// 2. Extract file/video from req.files
// 3. Validation of data
// 4. Upload the video to cloudinary
// 5. Create a sub-section
// 6. Update the Course Content Section with this Course Content Sub Section ObjectId
// 7. populate the courseContentSection

// Create Course Content SubSection
exports.createSubSection = async (req, res) => {

    try {
        // Fecth data from Req body
        const { sectionId, title, description } = req.body;

        // Extract file/video from req.files
        const video = req.files.videoFile;

        // Validation of data
        if (!sectionId || !title || !description || !video) {
            return res.status(400).json({
                success: false,
                message: "Please check all the required fields. Some fields are missing."
            });
        }

        // Upload the video to cloudinary
        const videoUploadDetails = await uploadMediaToCloudinary(video, process.env.CLOUDINARY_FOLDER_NAME);

        //create a sub-section
        const subSectionDetails = await CourseContentSubSection.create({
            title: title,
            description: description,
            timeDuration: `${videoUploadDetails.duration}`,
            videoUrl: videoUploadDetails.secure_url
        });

        // Update the Course Content Section with this Course Content Sub Section ObjectId
        // const courseContentSection = await CourseContentSection.findById(sectionId);
        // courseContentSection.subSection.push(subSectionDetails._id);
        // await courseContentSection.save();
        // Update the corresponding section with the newly created sub-section
        const courseContentSection = await CourseContentSection.findByIdAndUpdate({ _id: sectionId }, { $push: { subSection: subSectionDetails._id } }, { new: true }).populate("subSection")

        // // populate the courseContentSection 
        // await courseContentSection.populate('subSection').execPopulate();

        return res.status(200).json({
            succcess: true,
            message: `Sub Section "${title}" created successfully in "${courseContentSection.sectionName}" section`,
            courseContentSection: courseContentSection
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error while creating sub-section",
            error: error.message
        })
    }
};

// UPDATE THE COURSE CONTENT SUBSECTION
// 1. Fetch data from Req body
// 2. Fetch the sub-section
// 3. Validation of data
// 4. Validating each data field seperately as user can update any field or all fields
// 5. Update the data fields
// 6. Save the updated sub-section

// Update the Course Content SubSection
exports.updateSubSection = async (req, res) => {

    try {
        // Fecth data from Req body
        const { subSectionId, title, description } = req.body;

        // Fetch the sub-section
        const courseContentSubSection = await CourseContentSubSection.findById(subSectionId);

        // Validation of data
        if(!courseContentSubSection) {
            return res.status(404).json({
                success: false,
                message: "Sub Section not found"
            })
        }

        // Validating each data field seperately as user can update any field or all fields
        if(title !== undefined){
            courseContentSubSection.title = title; // if title is present in req.body then update the title
        }

        if(description !== undefined){
            courseContentSubSection.description = description; // if description is present in req.body then update the description
        }

        // Extract file/video from req.files
        if (req.files && req.files.videoFile !== undefined) { // if video is present in req.files then update the video
            const video = req.files.videoFile;
            const uploadVideoDetails = await uploadMediaToCloudinary(video, process.env.CLOUDINARY_FOLDER_NAME);
            courseContentSubSection.videoUrl = uploadVideoDetails.secure_url; // update the video url
            courseContentSubSection.timeDuration = `${uploadVideoDetails.duration}`; // As Schema is expecting timeDuration in string format
        }

        // Save the updated sub-section
        await courseContentSubSection.save();

        return res.status(200).json({
            succcess: true,
            message: `Sub Section "${title}" updated successfully`,
            subSectionDetails: courseContentSubSection
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error while updating sub-section",
            error: error.message
        })
    }
};

// DELETE THE COURSE CONTENT SUBSECTION\
// 1. Fetch data from Req body
// 2. Remove the Sub Section ObjectId from Course Content Section
// 3. Delete the sub-section
// 4. Validate the data

// Delete the Course Content SubSection
exports.deleteSubSection = async (req, res) => {

    try {
        // Fecth data from Req body
        const { subSectionId, sectionId } = req.body;

        // Remove the Sub Section ObjectId from Course Content Section
        const courseContentSection = await CourseContentSection.findById(sectionId);
        courseContentSection.subSection.pull(subSectionId);
        await courseContentSection.save();

        // Delete the sub-section
        const subSectionDetails = await CourseContentSubSection.findByIdAndDelete(subSectionId);

        // Validate the data
        if (!subSectionDetails) {
            return res.status(404).json({
                success: false,
                message: "Sub Section not found"
            })
        }

        return res.status(200).json({
            succcess: true,
            message: `Sub Section "${subSectionDetails.title}" deleted successfully`,
            subSectionDetails: subSectionDetails
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error while deleting sub-section",
            error: error.message
        })
    }
};