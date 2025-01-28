

const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
require("dotenv").config(); // To load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable for port

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Middleware
app.use(cors());

// CORS Configurtion
const corsOptions = {
  origin: "https://twilio-sms-sending-frontend.vercel.app", // Your frontend domain
  methods: "GET,POST,PUT,DELETE", // Allow specific HTTP methods
  allowedHeaders: "Content-Type,Authorization", // Allow specific headers
};
app.use(cors(corsOptions));
// app.use(cors(corsOptions));
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the Twilio Message Sending API!");
});

// Message sending endpoint
app.post("/send-message", async (req, res) => {
  const { to, message } = req.body;

  try {
    const response = await client.messages.create({
      body: message,          // Message content
      from: process.env.TWILIO_PHONE_NUMBER,   // Your Twilio phone number from env
      to: to,                 // Receiver's phone number
    });
    res.status(200).json({ message: "Message sent successfully!", sid: response.sid });
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error: error.message });
  }
});

// Pre-defined message route
app.get("/send-default-message", async (req, res) => {
  const to = process.env.RECEIVER_PHONE_NUMBER; // Use receiver phone from environment
  const message = "Hello, Malti! This is a test message sent using Twilio and Node.js.";

  try {
    const response = await client.messages.create({
      body: message,          // Message content
      from: process.env.TWILIO_PHONE_NUMBER,   // Twilio phone number from env
      to: to,                 // Receiver's phone number
    });
    console.log("Message sent:", response.sid);
    res.status(200).json({ message: "Message sent successfully!", sid: response.sid });
  } catch (error) {
    console.error("Failed to send message:", error.message);
    res.status(500).json({ message: "Failed to send message", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
