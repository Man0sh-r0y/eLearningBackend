const cloudinary = require('cloudinary').v2; // import cloudinary
require('dotenv').config(); // import dotenv

// Connect to Cloudinary
exports.cloudinaryConnect = () => {
    
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // replace with your cloud_name
            api_key: process.env.CLOUDINARY_API_KEY, // replace with your api_key
            api_secret: process.env.CLOUDINARY_API_SECRET // replace with your api_secret
        });
    } catch (error) {
        console.log(`Error occured while connecting to Cloudinary: ${error}`);
    }
}