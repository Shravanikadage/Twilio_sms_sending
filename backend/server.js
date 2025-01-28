const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all requests

// Twilio client setup
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send SMS route
app.post("/send-message", (req, res) => {
    const { to, message } = req.body;

    if (!to || !message) {
        return res.status(400).json({ error: "Phone number and message are required!" });
    }

    client.messages
        .create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER, // Ensure this is your Twilio phone number
            to: to,
        })
        .then((response) => {
            return res.status(200).json({ success: true, data: response });
        })
        .catch((err) => {
            return res.status(500).json({ success: false, error: err.message });
        });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
