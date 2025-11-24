// ---------------------------
// SYMPTOM CHECKER
// ---------------------------
const symptomForm = document.getElementById("symptomForm");
const symptomInput = document.getElementById("symptomInput");
const symptomResults = document.getElementById("symptomResults");

symptomForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const symptoms = symptomInput.value
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  if (!symptoms.length) {
    symptomResults.innerHTML = "<p>Please enter at least one symptom.</p>";
    return;
  }

  symptomResults.innerHTML = "<p>Analyzing symptoms...</p>";

  try {
    const res = await fetch("http://localhost:3000/analyze-symptoms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symptoms,
        patientInfo: { age: 35, gender: "female", height: 165, weight: 65 },
        lang: "en"
      })
    });

    if (!res.ok) throw new Error(`API returned status ${res.status}`);

    const data = await res.json();

    if (!data || !Array.isArray(data) || data.length === 0) {
      symptomResults.innerHTML = "<p>No conditions found for these symptoms. Try different keywords.</p>";
      return;
    }

    // Build results HTML
    let html = "<h4>Possible Conditions:</h4><ul>";
    data.forEach(item => {
      const name = item.condition || item.name || "Unknown Condition";
      const description = item.description || item.summary || "No description available.";
      const probability = item.probability || 0;

      let severity = "low";
      if (probability > 70) severity = "high";
      else if (probability > 40) severity = "medium";

      html += `<li class="${severity}"><strong>${name}</strong> — Probability: ${probability}%<p>${description}</p></li>`;
    });
    html += "</ul>";

    symptomResults.innerHTML = html;

  } catch (err) {
    console.error("Symptom analysis error:", err);
    symptomResults.innerHTML = `
      <p>Error analyzing symptoms. Please check your input or try again later.</p>
      <small>${err.message}</small>
    `;
  }
});

// ---------------------------
// CLINIC FINDER
// ---------------------------
const findClinicsBtn = document.getElementById("findClinicsBtn");
const clinicsList = document.getElementById("clinicsList");

findClinicsBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    clinicsList.innerHTML = "<li>Geolocation not supported.</li>";
    return;
  }

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;
    clinicsList.innerHTML = "<li>Searching nearby clinics...</li>";

    try {
      const resp = await fetch(`http://localhost:3000/nearby-clinics?lat=${latitude}&lng=${longitude}`);
      const data = await resp.json();

      if (!data.results || data.results.length === 0) {
        clinicsList.innerHTML = "<li>No clinics found nearby.</li>";
        return;
      }

      let html = "";
      data.results.forEach(place => {
        const name = place.name || "Unnamed";
        const vicinity = place.vicinity || place.formatted_address || "";
        html += `<li><strong>${name}</strong> — ${vicinity}</li>`;
      });
      clinicsList.innerHTML = html;

    } catch (err) {
      console.error(err);
      clinicsList.innerHTML = "<li>Error fetching clinics.</li>";
    }
  }, () => {
    clinicsList.innerHTML = "<li>Unable to access location.</li>";
  });
});

// ---------------------------
// SMS REMINDER
// ---------------------------
const sendSMSBtn = document.getElementById("sendSMSBtn");

sendSMSBtn.addEventListener("click", async () => {
  const phone = prompt("Enter recipient phone number (with country code):");
  const message = prompt("Enter your message:");
  if (!phone || !message) return;

  try {
    const res = await fetch("http://localhost:3000/send-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: phone, message })
    });

    const json = await res.json();
    if (json.success) alert("SMS sent!");
    else alert("Failed to send SMS: " + (json.error || "unknown"));

  } catch (err) {
    console.error(err);
    alert("Error sending SMS.");
  }
});

