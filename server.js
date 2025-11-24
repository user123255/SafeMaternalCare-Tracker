// server.js
const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Twilio client
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// ---------------------------
// Symptom Checker Endpoint
// ---------------------------
app.post("/analyze-symptoms", async (req, res) => {
  try {
    const { symptoms = [], patientInfo = {}, lang = "en" } = req.body;

    const message = symptoms.length
      ? `Patient has symptoms: ${symptoms.join(", ")}. Provide possible causes and advice.`
      : "What are common women's health issues?";

    console.log("Sending to RapidAPI:", JSON.stringify({
      prompt: message,
      specialty: "gynecology",
      language: lang
    }, null, 2));

    const rapidUrl =
      "https://ai-doctor-api-ai-medical-chatbot-healthcare-ai-assistant.p.rapidapi.com/chat?noqueue=1";

    const apiRes = await fetch(rapidUrl, {
      method: "POST",
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: message,
        specialty: "gynecology",
        language: lang,
      }),
    });

    if (!apiRes.ok) {
      const text = await apiRes.text();
      console.error("RapidAPI returned error:", text);
      return res.status(apiRes.status).json({ error: "RapidAPI error", details: text });
    }

    const data = await apiRes.json();
    res.json(data);

  } catch (err) {
    console.error("Error in /analyze-symptoms:", err);
    res.status(500).json({ error: "Server error calling RapidAPI" });
  }
});

// ---------------------------
// Clinic Finder Endpoint
// ---------------------------
app.get("/nearby-clinics", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: "lat and lng required" });

    const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY;
    console.log(`Fetching clinics for lat=${lat}, lng=${lng}`);

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=hospital&key=${GOOGLE_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      console.error("Google Maps API error:", text);
      return res.status(response.status).json({ error: "Google Maps API error", details: text });
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      console.warn("No clinics found nearby.");
      return res.json({ results: [], message: "No clinics found nearby." });
    }

    res.json(data);

  } catch (err) {
    console.error("Error in /nearby-clinics:", err);
    res.status(500).json({ error: "Failed to fetch clinics" });
  }
});

// ---------------------------
// SMS Reminder Endpoint
// ---------------------------
app.post("/send-sms", async (req, res) => {
  try {
    const { to, message } = req.body;
    if (!to || !message) return res.status(400).json({ success: false, error: "to and message are required" });

    console.log(`Sending SMS to ${to}: ${message}`);

    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    console.log("SMS sent:", sms.sid);
    res.json({ success: true, sid: sms.sid });

  } catch (err) {
    console.error("Error in /send-sms:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health-check
app.get("/", (req, res) => res.send("Backend running"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

