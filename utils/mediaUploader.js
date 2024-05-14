const cloudinary = require('cloudinary').v2; // Import cloudinary version 2

exports.uploadMediaToCloudinary = async (file, folder, height, quality) => {
    try {
        const options = {folder}; 

        if(height) options.height = height;
        if(quality) options.quality = quality;

        options.resource_type = 'auto'; // Automatically detect the file type 

        return await cloudinary.uploader.upload(file.tempFilePath, options); // Upload image to cloudinary
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error occured while uploading image to cloudinary',
            error: error.message
        });
    }
}