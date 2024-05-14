const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// LOGIC:
// if User forgot the password, 
// then user can click on forgot password button 
// Then a link will be sent to user's email
// and if user click on that link
// then user will be redirected to forgot password page
// for this link, I have to generate a token 
// And Link will be like this: `http://localhost:3000/update-password/${token}`
// The token will be valid for 10 minutes
// so the link will also be valid for 10 minutes
// If we don't do this, then user can change password for any number of times

// generate token
exports.generateForgotPasswordToken = async (req, res) => {
    try {
        // Fetch email from req body
        const { email } = req.body;

        // check if user exists in DataBase
        if(!await User.findOne({ email })) {
            return res.status(401).json({
                success: false,
                message: "User does not exists"
            });
        }

        // generate token
        const token = crypto.randomUUID(); // this will generate a random token
        
        // When User click on the link which is sent to email, it will be redirected to reset password page
        // To reset password, User have to send new password and confirm password along with the token
        // so This token will help to fetch the user from the database in the Backend
        // so the token need to be stored in the DataBase in the user's document

        await User.findOneAndUpdate({ email }, { token: token, expires: Date.now() + 5 * 60 * 1000 }, { new: true }); // find user with email and add token to the user's document

        // create URL
        const url = `http://localhost:3000/update-password/${token}`; // this URL will be sent to user's email

        // send email to user
        await mailSender.sendMail(email, "Reset Password", `Click on the link to reset password: ${url}`);

        // send response
        res.status(200).json({
            success: true,
            message: "Email sent successfully, please check your email"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while generating token, please try again later",
            error: error.message
        });
    }
}

// Reset forgot password
exports.resetForgotPassword = async (req, res) => {
    try {
        // fetch data from req body
        const { token, password, confirmPassword } = req.body;

        // validation (check if all fields are present or not)
        if(!token || !password || !confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            });
        }

        // check if password and confirm password are same or not
        if(password !== confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "Password and Confirm Password must be same"
            });
        }

        // fetch user from DataBase using token
        const user = await User.findOne({ token: token });

        // if user not found
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        // check if token is expired or not
        if(user.expires < Date.now()) {
            return res.status(401).json({
                success: false,
                message: "Token is expired, Please regenerate your token"
            });
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // update password in DataBase
        await User.findOneAndUpdate({token: token}, {password: hashedPassword}, {new: true});

        // send response
        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting password, please try again later",
            error: error.message
        });
    }
}
