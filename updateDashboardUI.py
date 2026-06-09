import re

file_path = "client/patient-dashboard.html"
with open(file_path, "r") as f:
    content = f.read()

# 1. Update Welcome Text
welcome_text = """
        <div class="welcome-text">
            <h1>Welcome, <span id="ptName">Patient</span></h1>
            <p>Your journey to holistic healing starts here. ID: <strong id="ptId">---</strong></p>
            <p style="margin-top: 10px; font-weight: 500; color: #e3f0e8;">Primary Condition: <span id="ptDisease">---</span></p>
        </div>
"""
content = content.replace('''        <div class="welcome-text">
            <h1>Welcome, <span id="ptName">Patient</span></h1>
            <p>Your journey to holistic healing starts here. ID: <strong id="ptId">---</strong></p>
        </div>''', welcome_text)

# 2. Update Treatment Card
treatment_card = """
        <!-- Treatment & Therapists Card -->
        <div class="card">
            <div class="card-header">
                <span class="card-icon">🌸</span>
                <h2>Today's Treatment</h2>
            </div>
            <div class="card-body" style="text-align: center;">
                <h3 style="color: var(--text-muted); margin-bottom: 10px; font-weight: 500; font-size: 1rem;">Primary Plan</h3>
                <div class="treatment-badge" id="ptTreatment">Loading...</div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px; text-align: left; background: var(--bg-color); padding: 15px; border-radius: 12px;">
                    <div>
                        <small style="color: var(--text-muted); font-weight: 600;">Time</small>
                        <div id="ptTreatmentTime" style="font-weight: 500;">-</div>
                    </div>
                    <div>
                        <small style="color: var(--text-muted); font-weight: 600;">Room</small>
                        <div id="ptTreatmentRoom" style="font-weight: 500;">-</div>
                    </div>
                    <div style="grid-column: span 2;">
                        <small style="color: var(--text-muted); font-weight: 600;">Assigned Therapist</small>
                        <div id="ptTherapist" style="font-weight: 500; color: var(--primary-dark);">-</div>
                    </div>
                </div>

                <div style="margin-top: 15px; text-align: left; background: #fff8e1; padding: 15px; border-radius: 12px; border: 1px solid #ffe082;">
                    <small style="color: #b37322; font-weight: 600;">Dos & Don'ts</small>
                    <div id="ptDosDonts" style="font-size: 0.95rem; line-height: 1.5; margin-top: 5px;">Follow general hospital guidelines.</div>
                </div>
            </div>
        </div>
"""
content = re.sub(r'        <!-- Treatment & Therapists Card -->.*?        <!-- Meals Card -->', treatment_card + '\n        <!-- Meals Card -->', content, flags=re.DOTALL)

# 3. Add Yoga to Meals Card or create new Routine Card
# Let's add Yoga inside the Meal Timings card and rename it to "Daily Routine"
routine_card = """
        <!-- Routine Card -->
        <div class="card">
            <div class="card-header">
                <span class="card-icon">☀️</span>
                <h2>Daily Routine</h2>
            </div>
            <div class="card-body" style="padding: 0;">
                <div class="meal-timing">
                    <span class="meal-name">🧘‍♀️ Yoga Session</span>
                    <span class="meal-time" id="timeYoga" style="background: #e3f0e8; color: var(--primary-dark);">06:00 AM</span>
                </div>
                <div class="meal-timing">
                    <span class="meal-name">🌅 Breakfast</span>
                    <span class="meal-time" id="timeBreakfast">08:00 AM</span>
                </div>
                <div class="meal-timing">
                    <span class="meal-name">☀️ Lunch</span>
                    <span class="meal-time" id="timeLunch">01:00 PM</span>
                </div>
                <div class="meal-timing">
                    <span class="meal-name">🌙 Dinner</span>
                    <span class="meal-time" id="timeDinner">07:30 PM</span>
                </div>
            </div>
        </div>
"""
content = re.sub(r'        <!-- Meals Card -->.*?        <!-- Medicines Card -->', routine_card + '\n        <!-- Medicines Card -->', content, flags=re.DOTALL)


# 4. Update JS Logic to map the fields
js_map = """
        // Populate UI
        document.getElementById("ptName").textContent = patientData.name || "Guest";
        document.getElementById("ptId").textContent = patientData.patientId || patientData._id || "N/A";
        document.getElementById("ptRoom").textContent = patientData.roomNumber || "TBD";
        document.getElementById("ptDisease").textContent = patientData.disease || "Not specified";
        document.getElementById("ptTreatment").textContent = patientData.treatmentPlan || "General Consultation";
        
        // Treatment Details
        document.getElementById("ptTreatmentTime").textContent = patientData.treatmentTime || "TBD";
        document.getElementById("ptTreatmentRoom").textContent = patientData.treatmentRoom || "TBD";
        document.getElementById("ptTherapist").textContent = patientData.assignedTherapist || "Please check with reception";
        document.getElementById("ptDosDonts").textContent = patientData.dosAndDonts || "Follow general hospital guidelines.";
        
        // Routine Timings
        document.getElementById("timeYoga").textContent = patientData.yogaTiming || "06:00 AM";

        // Meal Timings
        if (patientData.mealTimings) {
            if (patientData.mealTimings.breakfast) document.getElementById("timeBreakfast").textContent = patientData.mealTimings.breakfast;
            if (patientData.mealTimings.lunch) document.getElementById("timeLunch").textContent = patientData.mealTimings.lunch;
            if (patientData.mealTimings.dinner) document.getElementById("timeDinner").textContent = patientData.mealTimings.dinner;
        }
"""
content = re.sub(r'        // Populate UI.*?        // Meal Timings\n.*?        }\n', js_map + '\n', content, flags=re.DOTALL)


# 5. Add Notification Engine
notification_engine = """
    // --- Notification Engine ---
    let activeAlerts = new Set();

    function showNotification(title, message, icon) {
        // Prevent duplicate alerts for the same event
        if (activeAlerts.has(title)) return;
        activeAlerts.add(title);
        
        const notif = document.createElement("div");
        notif.className = "fade-in-up";
        notif.style.cssText = `
            position: fixed; bottom: 30px; right: 30px; background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px); border: 1px solid var(--border); box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            padding: 20px; border-radius: 16px; z-index: 9999; display: flex; gap: 15px; align-items: center; max-width: 350px;
        `;
        notif.innerHTML = `
            <div style="font-size: 2.5rem;">${icon}</div>
            <div>
                <h4 style="margin-bottom: 5px; color: var(--primary-dark);">${title}</h4>
                <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.4;">${message}</p>
            </div>
            <button style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 1.2rem; cursor: pointer;" onclick="this.parentElement.remove()">✕</button>
        `;
        document.body.appendChild(notif);
        
        // Auto remove after 15 seconds
        setTimeout(() => { if(document.body.contains(notif)) notif.remove(); activeAlerts.delete(title); }, 15000);
    }

    function checkSchedules() {
        if (!patient) return;
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();

        // Helper to parse HH:MM AM/PM to comparable minutes
        const parseTime = (timeStr) => {
            if (!timeStr) return -1;
            const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
            if(!match) return -1;
            let [_, h, m, ampm] = match;
            h = parseInt(h); m = parseInt(m);
            if (ampm && ampm.toUpperCase() === 'PM' && h !== 12) h += 12;
            if (ampm && ampm.toUpperCase() === 'AM' && h === 12) h = 0;
            return h * 60 + m;
        };

        const nowMinutes = currentHours * 60 + currentMinutes;

        // Check Treatment (10 min warning)
        const treatMins = parseTime(patient.treatmentTime);
        if (treatMins !== -1 && (treatMins - nowMinutes) === 10) {
            showNotification("Upcoming Treatment", `Your treatment starts in 10 minutes at ${patient.treatmentRoom || 'your room'}.`, "🌸");
        }

        // Check Meals (Exact time)
        if (patient.mealTimings) {
            if (parseTime(patient.mealTimings.breakfast) === nowMinutes) showNotification("Breakfast Time", "Your breakfast is ready. Please proceed to the dining area.", "🌅");
            if (parseTime(patient.mealTimings.lunch) === nowMinutes) showNotification("Lunch Time", "Your lunch is ready. Enjoy your meal.", "☀️");
            if (parseTime(patient.mealTimings.dinner) === nowMinutes) showNotification("Dinner Time", "Your dinner is ready. Remember to eat light.", "🌙");
        }

        // Check Medicines (Exact time)
        if (patient.medicines && patient.medicines.length > 0) {
            patient.medicines.forEach(med => {
                // If the medicine time matches exactly (e.g. "Morning", "08:00 AM" etc. Since it's free text, let's try to parse if it's a time)
                const medMins = parseTime(med.time);
                if (medMins === nowMinutes) {
                    showNotification("Medicine Reminder", `It's time to take ${med.name} (${med.dosage}).`, "💊");
                }
            });
        }
    }

    // Run every minute
    setInterval(checkSchedules, 60000);
    // Initial check just in case
    setTimeout(checkSchedules, 2000);

"""
content = content.replace('function logout() {', notification_engine + '\n    function logout() {')


with open(file_path, "w") as f:
    f.write(content)
print("Updated patient-dashboard.html successfully.")
