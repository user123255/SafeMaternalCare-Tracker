# 🍼 SafeMaternalCare Tracker

**SafeMaternalCare Tracker** is a simple, user-friendly web app designed to help expectant mothers monitor their health, get AI-powered guidance on symptoms, find nearby clinics, and set SMS reminders for appointments or medications.  

Our mission is to make maternal healthcare easier, safer, and accessible.  

 🌟 Features

 1️⃣ AI Symptom Checker
- Enter one or more symptoms to get possible conditions.
- Shows risk level, description, matching symptoms, and advice.
- Powered by a trusted AI medical API.  

Screenshot:  
![Symptom Checker](screenshots/symptom-checker.png)

---

2️⃣ Clinic Finder
- Finds nearby hospitals or maternal health centers using your location.
- Provides clinic names and addresses for quick access.  

Screenshot: 
![Clinic Finder](screenshots/clinic-finder.png)

3️⃣ SMS Reminders
- Send reminders for doctor visits or medications.
- Uses Twilio API to send messages directly to your phone.  

Screenshot: 
![SMS Reminder](screenshots/sms-reminder.png)

🏗 How It Works (Step-by-Step)

Symptom Checker
1. Go to **Tools → Symptom Checker**.
2. Type your symptoms separated by commas.
3. Click **Analyze**.
4. The app fetches possible conditions and displays:
   - Condition name
   - Risk level (Low, Medium, High)
   - Matching symptoms
   - Recommended actions

 Clinic Finder
1. Go to **Tools → Find Nearby Clinics**.
2. Click **Find Clinics Near Me**.
3. Your location is detected automatically.
4. Nearby clinics appear with their addresses.

 SMS Reminder
#SMS Reminder
1. Go to **Tools → SMS Reminder**.
2. Enter the phone number and message.
3. Click **Send SMS** to notify the recipient.

 Project structure 
<img width="490" height="318" alt="Screenshot 2025-11-24 165159" src="https://github.com/user-attachments/assets/168abb84-496b-4664-8228-39f0e3c7d199" />



#Installation and setup 
clone the repository
git clone git@github.com:user123255/SafeMaternalCare-Tracker.git
cd SafeMaternalCare-Tracker


🛠 Technologies Used

Frontend: HTML, CSS, JavaScript

Backend: Node.js, Express.js

APIs: RapidAPI (Symptom Checker), Google Maps Places API (Clinics), Twilio (SMS)

Other: .env for secrets, npm for package management

❤️ License

MIT License – free to use and modify for personal and educational projects.


👩‍⚕️ SafeMaternalCare Tracker

Helps  mothers stay healthy, one check at a time! 💖
