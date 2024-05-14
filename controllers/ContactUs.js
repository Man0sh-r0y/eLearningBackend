const mailSender = require('../utils/mailSender');
const contactUsEmail = require('../mail/templates/contactUsEmail');
require('dotenv').config();

exports.contactUs = async (req, res) => {

    try {
        // Fetch the fields from the request body
        const { firstName, lastName, countryCode, contactNo, email, message } = req.body;

        // Validate the fields
        if (!firstName || !lastName || !email || !message) {
            return res.status(400).json({ 
                success: false,
                message: "Please fill all the fields" 
            });
        }

        // Get the contactUsEmail template for the mail
        const templateEmail = contactUsEmail(email, firstName, lastName, message, contactNo, countryCode);

        // Send mail to student who filled the form 
        await mailSender(email, "Contact Form Confirmation", templateEmail); 

        // Send mail to admin
        await mailSender(process.env.MAIL_USER, // send mail to admin
            `Contact Us Form filled up`, 
            `<h1> Contact Us Form filled by the Student ${firstName} ${lastName} </h1> <br/>
             <p> Student filled the contact form. Email: ${email}, Phone: ${countryCode} ${contactNo} </p>`); 
        
        return res.status(200).json({
            success: true,
            message: `Contact Us form filled by ${firstName} ${lastName} successfully and mail sent to ${email}`
        });
        
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `Error occured while sending mail to the Student who filled up the Contact Us form`,
            error: error.message
        })
    }
}