import { useState } from "react";
import axios from "axios";
import './style.css';

// Define the constant for the country code
const COUNTRY_CODE = "+91"; // You can change this if you're using a different country code

function App() {
    const [phone, setPhone] = useState(""); 
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");

    // Format phone number to include the constant country code
    const formatPhoneNumber = (number) => {
        return `${COUNTRY_CODE}${number}`;
    };

    const handleSendMessage = async () => {
      const formattedPhone = formatPhoneNumber(phone);
      try {
          const response = await axios.post(
              "https://twilio-sms-sending-backend.vercel.app/send-message", 
              {
                  to: formattedPhone,
                  message: message,
              },
              {
                  headers: {
                      'Content-Type': 'application/json', // Ensure server expects this
                  },
              }
          );
          setStatus("Message sent successfully!");
      } catch (error) {
          setStatus(`Failed to send message: ${error.response?.data?.error || error.message}`);
      }
  };
  
    const handlePhoneChange = (e) => {
        // Remove any non-numeric characters after the country code
        const localPhone = e.target.value.replace(/[^0-9]/g, '');
        
        // Allow user to type only the local number part
        setPhone(localPhone);
    };

    return (
        <div className="container">
            <h1>Send SMS with Twilio</h1>
            <div className="input-container">
                <div className="country-code">{COUNTRY_CODE}</div>
                <input
                    type="text"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="phone-input"
                />
            </div>
            <textarea
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-field"
            />
            <button onClick={handleSendMessage}>Send Message</button>
            {status && <p>{status}</p>}
        </div>
    );
}

export default App;
