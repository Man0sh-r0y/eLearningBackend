const express = require('express'); // import express
const app = express(); // initialize express
require('dotenv').config(); // import dotenv

// Import Routes from routes folder
const userRoutes = require('./routes/User');
const profileRoutes = require('./routes/Profile');
const courseRoutes = require('./routes/Course');
const paymentRoutes = require('./routes/Payment');
const contactUsRoutes = require('./routes/ContactUs');

// import all the other required modules
const dbConnect = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {cloudinaryConnect} = require('./config/cloudinary');
const fileUpload = require('express-fileupload');

// Middilewares
app.use(express.json()); // for parsing application/json
app.use(cookieParser()); // for parsing cookies
app.use(cors({ // for allowing cross origin requests
    origin: process.env.CLIENT_URL,
    credentials: true
})); 
app.use(fileUpload({ // for parsing files
    useTempFiles: true,
    tempFileDir: '/tmp/'
})); 

// Set Up the PORT
const PORT = process.env.PORT || 5000; // set up the port

// Connect to the database
dbConnect();

// Connect to Cloudinary
cloudinaryConnect();

// Use Routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/', contactUsRoutes);

// define the routes
app.get('/', (req, res) => { // define the home route
    res.json({
        success: true,
        message: 'This is the home route for the server'
    })
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`);
});