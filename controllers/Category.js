const Category = require("../models/Category");
const Course = require("../models/Course");

// Create a new category
exports.createCategory = async (req, res) => {

    try {
        // Fetching the data from the request body
        const { name, description } = req.body;

        // Validating the data
        if (!name) {
            return res.status(400).json({
                success: false, 
                message: "All fields are required"
            });
        }

        // Creating a new category
        const categorysDetails = await Category.create({
            name: name,
            description: description
        });
        
        return res.status(200).json({
            success: true,
            message: `Category ${name} Created Successfully`,
            categoryDetails: categorysDetails
        });
    } catch (error) {
        return res.status(500).json({
            success: true,
            message: "Unable to create category",
            message: error.message
        });
    }
};

// Show all categories
exports.showAllCategories = async (req, res) => {

    try {
        // Fetching all categories
        const allCategories = await Category.find({},{ // Feching the data from which should have the name and description
            name: true, 
            description: true 
        });
        
        res.status(200).json({
            success: true,
            message: "Fetched all the Categories",
            data: allCategories
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch all categories",
            message: error.message
        });
    }
};

// Category Page Details
exports.categoryPageDetails = async (req, res) => {

    try {
        // Get the categoryId from the request body
        const { categoryId } = req.body;

        // Get courses for specified categoryId
        const categoryDetails = await Category.findById(categoryId).populate("courses").exec();

        // Validate the data
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: 'Category Not Found'
            });
        }

        // Get courses for different categories
        const differentCategories = await Category.find({ 
            _id: { 
                $ne: categoryId // $ne means not equal, so here we are fetching all the categories except the one which is selected
            }
        }).populate("courses").exec();

        // Get top 10 selling courses
        const top10SellingCourses = await Course.find({}).sort({ studentEnrolled: -1 }).limit(10).exec(); // sorting the courses in descending order of the number of students enrolled and here -1 means sort in descending order

        return res.status(200).json({
            success: true,
            message: `${categoryDetails.name} Category Page Details Fetched Successfully`,
            data: {
                categoryDetails: categoryDetails,
                differentCategories: differentCategories,
                topSellingCourses: top10SellingCourses
            }
        });

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch category page details",
            message: error.message
        });
    }
}