const CourseContentSection = require("../models/CourseContentSection");
const Course = require("../models/Course");

// CREATE THE COURSE CONTENT SECTION
// 1. Fetch data from Req body
// 2. Create the course content section
// 3. Push the newly created section to the courseContent array in Course model
// 4. populate the courseContentSection and courseContentSubSection from the Course model

// Create the Course Content Section
exports.createSection = async (req, res) => {

    try {
        // Fetch data from request body
        const { sectionName, courseId } = req.body;

        // Data validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Please check all the required fields. Some fields are missing."
            });
        }

        // Create course content section
        const newSection = await CourseContentSection.create({ sectionName });

        // Push the newly created section to the courseContent array in Course model
        const updatedCourse = await Course.findByIdAndUpdate(courseId, { $push: { courseContent: newSection._id }}, { new: true }).populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			}).exec();
        
        return res.status(200).json({
            success: true,
            message: `Section ${sectionName} created successfully`,
            courseDetails: updatedCourse
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `Unable to create Section, please try again`,
            error: error.message
        });
    }
}

// Update the Course Content Section
exports.updateSection = async (req, res) => {

    try {
        // Fetch data from request body
        const { sectionName, sectionId } = req.body;

        // Data validation
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "Please check all the required fields. Some fields are missing."
            });
        }

        // Update the section name
        const sectionDetails = await CourseContentSection.findById(sectionId);
        const oldSectionName = sectionDetails.sectionName;
        sectionDetails.sectionName = sectionName;
        await sectionDetails.save(); // save the updated section name to the database

        return res.status(200).json({
            success: true,
            message: `Course Content Section name ${oldSectionName} has been changed to ${sectionName} Successfully`
        });

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `Unable to update the Course Content Section name to the new name, please try again`,
            error: error.message,
        });
    }
};

// DELETE THE COURSE CONTENT SECTION
// 1. Fetch data from Req params
// 2. Fetch the section
// 3. Delete the section from the courseContent array in Course model
// 4. Delete the section from the database

// Delete the Course Content Section
exports.deleteSection = async (req, res) => {

    try {
        // Fetch data from request body
        const { sectionId, courseId } = req.body;

        const courseContentSection = await CourseContentSection.findById(sectionId);

        if(!courseContentSection){
            return res.status(404).json({
                success: false,
                message: "Course Content Section not found"
            })
        }

        if(courseContentSection.subSection.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Course Content Section has sub sections. Please delete the sub sections first."
            })
        }

        // Delete the section from the courseContent array in Course model
        const courseDetails = await Course.findById(courseId);
        courseDetails.courseContent.pull(sectionId);
        await courseDetails.save();

        // Delete the section from the database
        await CourseContentSection.findByIdAndDelete(sectionId);

        return res.status(200).json({
            success: true,
            message: `Section ${courseContentSection.sectionName} Deleted Successfully`
        })

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete Section, please try again",
            error: error.message
        });
    }
}