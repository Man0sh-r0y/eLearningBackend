const nodemailer = require('nodemailer'); // import nodemailer
require('dotenv').config(); // import dotenv

// create transporter
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

module.exports = transporter;