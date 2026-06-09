import re

file_path = "client/patient.html"
with open(file_path, "r") as f:
    content = f.read()

# 1. Add Disease to Medical Details
disease_html = """
                        <li class="info-item">
                            <span class="info-label">Disease / Condition</span>
                            <span class="info-value" id="patientDisease" style="color: var(--primary-dark); font-weight: 600;">-</span>
                        </li>"""
content = content.replace('<li class="info-item">\n                            <span class="info-label">Treatment Plan</span>', disease_html + '\n                        <li class="info-item">\n                            <span class="info-label">Treatment Plan</span>')

# 2. Add Daily Routine Card before Assigned Medicines
routine_card = """
            <!-- Daily Routine & Logistics -->
            <div class="card full-width">
                <div class="card-header">
                    <h2>🕒 Daily Routine & Logistics</h2>
                    <button class="nav-btn nav-btn-outline" style="padding: 6px 12px; font-size: 0.9rem;" onclick="openRoutineModal()">Edit Routine</button>
                </div>
                <div class="card-body">
                    <ul class="info-list" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <li class="info-item">
                            <span class="info-label">Assigned Therapist</span>
                            <span class="info-value" id="dispTherapist">-</span>
                        </li>
                        <li class="info-item">
                            <span class="info-label">Treatment Room</span>
                            <span class="info-value" id="dispRoom">-</span>
                        </li>
                        <li class="info-item">
                            <span class="info-label">Treatment Time</span>
                            <span class="info-value" id="dispTreatmentTime">-</span>
                        </li>
                        <li class="info-item">
                            <span class="info-label">Yoga Timing</span>
                            <span class="info-value" id="dispYoga">-</span>
                        </li>
                        <li class="info-item">
                            <span class="info-label">Meal Timings</span>
                            <span class="info-value" id="dispMeals">Breakfast: - | Lunch: - | Dinner: -</span>
                        </li>
                        <li class="info-item" style="grid-column: span 2;">
                            <span class="info-label">Dos & Don'ts for Treatment</span>
                            <span class="info-value" id="dispDosDonts" style="line-height: 1.6; color: var(--text-muted);">-</span>
                        </li>
                    </ul>
                </div>
            </div>
"""
content = content.replace('<!-- Assigned Medicines -->', routine_card + '\n            <!-- Assigned Medicines -->')

# 3. Add Routine Modal
routine_modal = """
    <!-- Edit Routine Modal -->
    <div id="routineModal" class="modal" style="display: none;">
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2>Edit Daily Routine</h2>
                <button class="close-btn" onclick="closeRoutineModal()">✕</button>
            </div>
            <div class="modal-body" style="display: flex; flex-direction: column; gap: 15px;">
                <div class="form-group">
                    <label>Assigned Therapist</label>
                    <input type="text" id="inputTherapist" placeholder="E.g. Dr. Neetu Singh" style="width: 100%; padding: 10px;">
                </div>
                <div class="form-group">
                    <label>Treatment Room</label>
                    <select id="inputRoom" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border);">
                        <option value="">Select Room</option>
                        <option value="Ground Floor 1">Ground Floor 1</option>
                        <option value="Ground Floor 2">Ground Floor 2</option>
                        <option value="4th Floor 1">4th Floor 1</option>
                        <option value="4th Floor 2">4th Floor 2</option>
                        <option value="4th Floor 3">4th Floor 3</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Treatment Time</label>
                    <input type="time" id="inputTreatmentTime" style="width: 100%; padding: 10px;">
                </div>
                <div class="form-group">
                    <label>Yoga Timing</label>
                    <input type="time" id="inputYoga" style="width: 100%; padding: 10px;">
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                    <div class="form-group">
                        <label>Breakfast</label>
                        <input type="time" id="inputBreakfast" style="width: 100%; padding: 10px;">
                    </div>
                    <div class="form-group">
                        <label>Lunch</label>
                        <input type="time" id="inputLunch" style="width: 100%; padding: 10px;">
                    </div>
                    <div class="form-group">
                        <label>Dinner</label>
                        <input type="time" id="inputDinner" style="width: 100%; padding: 10px;">
                    </div>
                </div>
                <div class="form-group">
                    <label>Dos and Don'ts</label>
                    <textarea id="inputDosDonts" rows="4" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border);" placeholder="What to eat, what to avoid..."></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="nav-btn nav-btn-outline" onclick="closeRoutineModal()">Cancel</button>
                <button class="nav-btn" style="background: var(--primary); color: white;" onclick="saveRoutine()" id="saveRoutineBtn">Save Routine</button>
            </div>
        </div>
    </div>
"""
content = content.replace('<!-- Edit Medicines Modal -->', routine_modal + '\n    <!-- Edit Medicines Modal -->')

# 4. Update JS logic to map data
js_map = """
        document.getElementById("patientDisease").textContent = patient.disease || "Not specified";
        
        document.getElementById("dispTherapist").textContent = patient.assignedTherapist || "Unassigned";
        document.getElementById("dispRoom").textContent = patient.treatmentRoom || "Unassigned";
        document.getElementById("dispTreatmentTime").textContent = patient.treatmentTime || "Unassigned";
        document.getElementById("dispYoga").textContent = patient.yogaTiming || "Unassigned";
        document.getElementById("dispDosDonts").textContent = patient.dosAndDonts || "No specific instructions.";
        
        const meals = patient.mealTimings || {};
        document.getElementById("dispMeals").textContent = `Breakfast: ${meals.breakfast || '-'} | Lunch: ${meals.lunch || '-'} | Dinner: ${meals.dinner || '-'}`;
"""
content = content.replace('document.getElementById("patientTreatment").textContent', js_map + '\n        document.getElementById("patientTreatment").textContent')

# 5. Add JS functions for Routine Modal
js_funcs = """
    // --- Routine Modal Logic ---
    const routineModal = document.getElementById("routineModal");
    function openRoutineModal() {
        document.getElementById("inputTherapist").value = currentPatient.assignedTherapist || "";
        document.getElementById("inputRoom").value = currentPatient.treatmentRoom || "";
        document.getElementById("inputTreatmentTime").value = currentPatient.treatmentTime || "";
        document.getElementById("inputYoga").value = currentPatient.yogaTiming || "";
        document.getElementById("inputDosDonts").value = currentPatient.dosAndDonts || "";
        if (currentPatient.mealTimings) {
            document.getElementById("inputBreakfast").value = currentPatient.mealTimings.breakfast || "";
            document.getElementById("inputLunch").value = currentPatient.mealTimings.lunch || "";
            document.getElementById("inputDinner").value = currentPatient.mealTimings.dinner || "";
        }
        routineModal.style.display = "flex";
    }

    function closeRoutineModal() {
        routineModal.style.display = "none";
    }

    async function saveRoutine() {
        const btn = document.getElementById("saveRoutineBtn");
        btn.textContent = "Saving...";
        
        const payload = {
            assignedTherapist: document.getElementById("inputTherapist").value,
            treatmentRoom: document.getElementById("inputRoom").value,
            treatmentTime: document.getElementById("inputTreatmentTime").value,
            yogaTiming: document.getElementById("inputYoga").value,
            dosAndDonts: document.getElementById("inputDosDonts").value,
            mealTimings: {
                breakfast: document.getElementById("inputBreakfast").value,
                lunch: document.getElementById("inputLunch").value,
                dinner: document.getElementById("inputDinner").value
            }
        };

        try {
            const res = await fetch(`http://localhost:5001/api/patients/${patientId}/routine`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const data = await res.json();
                currentPatient = data.patient;
                renderPatient(currentPatient);
                closeRoutineModal();
            } else {
                alert("Failed to save routine");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving routine");
        } finally {
            btn.textContent = "Save Routine";
        }
    }
"""

content = content.replace('// Get ID from URL', 'let currentPatient = null;\n    // Get ID from URL')
content = content.replace('function renderPatient(patient) {', 'function renderPatient(patient) {\n        currentPatient = patient;')
content = content.replace('function addMedicineRow', js_funcs + '\n    function addMedicineRow')

with open(file_path, "w") as f:
    f.write(content)
print("Updated patient.html successfully.")
