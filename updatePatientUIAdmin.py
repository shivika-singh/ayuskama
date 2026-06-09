import os

file_path = "/Users/anshu/ayush care/client/patient.html"
with open(file_path, "r") as f:
    content = f.read()

# Add select for treatment and input for diet in the Routine Modal
# The routine modal starts around `<div id="routineModal" class="modal"`
# I will insert after `<div class="form-group"> <label>Assigned Therapist</label>...`

new_fields = """
                <div class="form-group">
                    <label>Treatment Plan / Protocol</label>
                    <select id="inputTreatment" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border);">
                        <option value="">Select Predefined Treatment</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Diet Plan</label>
                    <input type="text" id="inputDiet" placeholder="E.g. Vata Pacifying Diet" style="width: 100%; padding: 10px;">
                </div>
"""
content = content.replace('                <div class="form-group">\n                    <label>Treatment Room</label>', new_fields + '                <div class="form-group">\n                    <label>Treatment Room</label>')


# Also need to fetch treatments and populate select on page load
js_init = """
    document.addEventListener("DOMContentLoaded", async () => {
        try {
            const res = await fetch("http://localhost:5001/api/treatments");
            if (res.ok) {
                const treatments = await res.json();
                window.predefinedTreatments = treatments; // store globally for auto-filling
                const select = document.getElementById("inputTreatment");
                treatments.forEach(t => {
                    const opt = document.createElement("option");
                    opt.value = t.name;
                    opt.textContent = t.name;
                    select.appendChild(opt);
                });
                
                // Auto-fill protocol and dos/donts when a treatment is selected
                select.addEventListener("change", (e) => {
                    const selected = window.predefinedTreatments.find(t => t.name === e.target.value);
                    if (selected) {
                        if (selected.defaultDosAndDonts) {
                            document.getElementById("inputDosDonts").value = selected.defaultDosAndDonts;
                        }
                    }
                });
            }
        } catch (e) { console.log(e); }
    });

    let currentPatient = null;
"""
content = content.replace("    let currentPatient = null;", js_init)


# Update `openRoutineModal()` to populate the new fields
js_open_routine = """
        document.getElementById("inputCheckIn").value = patient.checkInDate ? new Date(patient.checkInDate).toISOString().split('T')[0] : "";
        document.getElementById("inputCheckOut").value = patient.checkOutDate ? new Date(patient.checkOutDate).toISOString().split('T')[0] : "";
        document.getElementById("inputTherapist").value = patient.assignedTherapist || "";
        document.getElementById("inputRoom").value = patient.treatmentRoom || "";
        document.getElementById("inputTreatmentTime").value = patient.treatmentTime || "";
        document.getElementById("inputYoga").value = patient.yogaTiming || "";
        
        document.getElementById("inputTreatment").value = patient.treatmentPlan || "";
        document.getElementById("inputDiet").value = patient.dietPlan || "";
"""
content = content.replace("""        document.getElementById("inputCheckIn").value = patient.checkInDate ? new Date(patient.checkInDate).toISOString().split('T')[0] : "";
        document.getElementById("inputCheckOut").value = patient.checkOutDate ? new Date(patient.checkOutDate).toISOString().split('T')[0] : "";
        document.getElementById("inputTherapist").value = patient.assignedTherapist || "";
        document.getElementById("inputRoom").value = patient.treatmentRoom || "";
        document.getElementById("inputTreatmentTime").value = patient.treatmentTime || "";
        document.getElementById("inputYoga").value = patient.yogaTiming || "";""", js_open_routine)


# Update `saveRoutine()` to send the new fields to backend
js_save_routine = """
            const treatmentPlan = document.getElementById("inputTreatment").value;
            const dietPlan = document.getElementById("inputDiet").value.trim();
            let treatmentProtocol = "";
            if (window.predefinedTreatments) {
                const selected = window.predefinedTreatments.find(t => t.name === treatmentPlan);
                if (selected) treatmentProtocol = selected.protocol;
            }
            
            const payload = {
                checkInDate: document.getElementById("inputCheckIn").value,
                checkOutDate: document.getElementById("inputCheckOut").value,
                assignedTherapist: document.getElementById("inputTherapist").value,
                treatmentRoom: document.getElementById("inputRoom").value,
                treatmentTime: document.getElementById("inputTreatmentTime").value,
                yogaTiming: document.getElementById("inputYoga").value,
                mealTimings: {
                    breakfast: document.getElementById("inputBreakfast").value,
                    lunch: document.getElementById("inputLunch").value,
                    dinner: document.getElementById("inputDinner").value
                },
                dosAndDonts: document.getElementById("inputDosDonts").value,
                treatmentPlan: treatmentPlan,
                dietPlan: dietPlan,
                treatmentProtocol: treatmentProtocol
            };
"""

# I will replace the exact save payload in `patient.html`.
# Let's write the whole file to check first, wait, it's safer to use re.
import re
content = re.sub(
    r'const payload = \{[\s\S]*?\n\s+\};',
    js_save_routine,
    content
)

with open(file_path, "w") as f:
    f.write(content)

print("Updated patient.html admin panel.")
