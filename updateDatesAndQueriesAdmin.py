import re

file_path = "client/patient.html"
with open(file_path, "r") as f:
    content = f.read()

# 1. Add Stay Duration to Page Header
header_dates = """
                <p>
                    <span class="status-badge" id="patientId">ID: Loading...</span>
                    Registered: <span id="patientDate">Loading...</span>
                </p>
                <div style="margin-top: 10px; display: flex; gap: 15px;">
                    <div style="background: var(--card-bg); padding: 5px 12px; border-radius: 8px; font-size: 0.9rem; border: 1px solid var(--border);">
                        <strong>Check-In:</strong> <span id="dispCheckIn">-</span>
                    </div>
                    <div style="background: var(--card-bg); padding: 5px 12px; border-radius: 8px; font-size: 0.9rem; border: 1px solid var(--border);">
                        <strong>Check-Out:</strong> <span id="dispCheckOut">-</span>
                    </div>
                </div>
"""
content = re.sub(r'<p>\s*<span class="status-badge" id="patientId">ID: Loading...</span>\s*Registered: <span id="patientDate">Loading...</span>\s*</p>', header_dates, content)

# 2. Add Dates to Routine Modal
modal_dates = """
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div class="form-group">
                        <label>Check-In Date</label>
                        <input type="date" id="inputCheckIn" style="width: 100%; padding: 10px;">
                    </div>
                    <div class="form-group">
                        <label>Check-Out Date</label>
                        <input type="date" id="inputCheckOut" style="width: 100%; padding: 10px;">
                    </div>
                </div>
                <div class="form-group">
"""
content = content.replace('<div class="form-group">\n                    <label>Assigned Therapist</label>', modal_dates + '                    <label>Assigned Therapist</label>')


# 3. Add Queries Card
queries_card = """
            <!-- Patient Queries -->
            <div class="card full-width">
                <div class="card-header">
                    <h2>💬 Patient Queries</h2>
                </div>
                <div class="card-body" id="queriesContainer" style="display: flex; flex-direction: column; gap: 15px;">
                    <div class="empty-state">Loading queries...</div>
                </div>
            </div>
"""
content = content.replace('<!-- Assigned Medicines -->', queries_card + '\n            <!-- Assigned Medicines -->')


# 4. Map the new data in JS (renderPatient)
js_map = """
        // Map Dates
        document.getElementById("dispCheckIn").textContent = patient.checkInDate ? new Date(patient.checkInDate).toLocaleDateString() : "Not set";
        document.getElementById("dispCheckOut").textContent = patient.checkOutDate ? new Date(patient.checkOutDate).toLocaleDateString() : "Not set";

        // Render Queries
        const queriesContainer = document.getElementById("queriesContainer");
        if (patient.queries && patient.queries.length > 0) {
            queriesContainer.innerHTML = "";
            patient.queries.slice().reverse().forEach(q => {
                const qDiv = document.createElement("div");
                qDiv.style.cssText = "border: 1px solid var(--border); border-radius: 12px; padding: 15px; background: #fafcfa;";
                
                const answeredHtml = q.status === "Answered" 
                    ? `<div style="margin-top: 10px; padding: 10px; background: #e8f5e9; border-radius: 8px; color: var(--primary-dark);">
                           <strong>Reply:</strong> ${q.answer}
                       </div>`
                    : `<div style="margin-top: 10px; display: flex; gap: 10px;">
                           <input type="text" id="answer-${q._id}" placeholder="Type your answer here..." style="flex: 1; padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px;">
                           <button class="nav-btn" style="background: var(--primary); color: white; padding: 8px 16px;" onclick="answerQuery('${q._id}')">Reply</button>
                       </div>`;

                qDiv.innerHTML = `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <strong>Q: ${q.question}</strong>
                        <small style="color: var(--text-muted);">${new Date(q.date).toLocaleString()}</small>
                    </div>
                    ${answeredHtml}
                `;
                queriesContainer.appendChild(qDiv);
            });
        } else {
            queriesContainer.innerHTML = `<div class="empty-state"><span>💬</span><p>No queries from this patient yet.</p></div>`;
        }
"""
content = content.replace('// Render Medicines', js_map + '\n        // Render Medicines')


# 5. Populate Routine Modal & Save
content = content.replace('document.getElementById("inputTherapist").value = currentPatient.assignedTherapist || "";', 
                          'document.getElementById("inputCheckIn").value = currentPatient.checkInDate ? currentPatient.checkInDate.split("T")[0] : "";\n        document.getElementById("inputCheckOut").value = currentPatient.checkOutDate ? currentPatient.checkOutDate.split("T")[0] : "";\n        document.getElementById("inputTherapist").value = currentPatient.assignedTherapist || "";')

content = content.replace('assignedTherapist: document.getElementById("inputTherapist").value,', 
                          'checkInDate: document.getElementById("inputCheckIn").value,\n            checkOutDate: document.getElementById("inputCheckOut").value,\n            assignedTherapist: document.getElementById("inputTherapist").value,')


# 6. Add answerQuery function
js_funcs = """
    async function answerQuery(queryId) {
        const answerInput = document.getElementById(`answer-${queryId}`);
        const answer = answerInput.value.trim();
        if (!answer) return alert("Please type an answer first.");

        answerInput.disabled = true;
        try {
            const res = await fetch(`http://localhost:5001/api/patients/${patientId}/queries/${queryId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answer })
            });
            if (res.ok) {
                const data = await res.json();
                currentPatient = data.patient;
                renderPatient(currentPatient);
            } else {
                alert("Failed to submit answer");
                answerInput.disabled = false;
            }
        } catch (err) {
            console.error(err);
            alert("Error submitting answer");
            answerInput.disabled = false;
        }
    }
"""
content = content.replace('function closeRoutineModal() {', js_funcs + '\n    function closeRoutineModal() {')


with open(file_path, "w") as f:
    f.write(content)
print("Updated patient.html successfully.")
