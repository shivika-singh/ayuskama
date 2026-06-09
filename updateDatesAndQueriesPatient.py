import re

file_path = "client/patient-dashboard.html"
with open(file_path, "r") as f:
    content = f.read()

# 1. Update Welcome Text to include dates
welcome_text = """
        <div class="welcome-text">
            <h1>Welcome, <span id="ptName">Patient</span></h1>
            <p>Your journey to holistic healing starts here. ID: <strong id="ptId">---</strong></p>
            <p style="margin-top: 10px; font-weight: 500; color: #e3f0e8;">Primary Condition: <span id="ptDisease">---</span></p>
            <div style="margin-top: 15px; display: inline-flex; gap: 15px; background: rgba(0,0,0,0.2); padding: 8px 16px; border-radius: 8px; font-size: 0.95rem;">
                <div><strong>Check-In:</strong> <span id="ptCheckIn">-</span></div>
                <div><strong>Check-Out:</strong> <span id="ptCheckOut">-</span></div>
            </div>
        </div>
"""
content = re.sub(r'<div class="welcome-text">.*?</div>', welcome_text, content, flags=re.DOTALL)

# 2. Add Ask a Question Card
queries_card = """
        <!-- Queries Card -->
        <div class="card" style="grid-column: span 2;">
            <div class="card-header">
                <span class="card-icon">💬</span>
                <h2>Ask a Question</h2>
            </div>
            <div class="card-body">
                <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                    <input type="text" id="queryInput" placeholder="Have a question about your treatment or meals? Ask here..." style="flex: 1; padding: 12px 16px; border: 1px solid var(--border); border-radius: 8px; font-size: 1rem;">
                    <button class="nav-btn" style="background: var(--primary); color: white; padding: 12px 24px;" onclick="submitQuery()" id="submitQueryBtn">Ask</button>
                </div>
                <div id="patientQueriesContainer" style="display: flex; flex-direction: column; gap: 10px;">
                    <div class="empty-state">Loading queries...</div>
                </div>
            </div>
        </div>
"""
content = content.replace('<!-- Medicines Card -->', queries_card + '\n        <!-- Medicines Card -->')


# 3. Update JS Logic to map the fields
js_map = """
        document.getElementById("ptDisease").textContent = patientData.disease || "Not specified";
        
        // Dates
        document.getElementById("ptCheckIn").textContent = patientData.checkInDate ? new Date(patientData.checkInDate).toLocaleDateString() : "Not set";
        document.getElementById("ptCheckOut").textContent = patientData.checkOutDate ? new Date(patientData.checkOutDate).toLocaleDateString() : "Not set";
"""
content = content.replace('document.getElementById("ptDisease").textContent = patientData.disease || "Not specified";', js_map)


# 4. Render Queries
js_queries = """
        // Queries
        const pqContainer = document.getElementById("patientQueriesContainer");
        if (patientData.queries && patientData.queries.length > 0) {
            pqContainer.innerHTML = "";
            patientData.queries.slice().reverse().forEach(q => {
                const qDiv = document.createElement("div");
                qDiv.style.cssText = "border: 1px solid var(--border); border-radius: 10px; padding: 15px; background: #fafcfa;";
                
                const answeredHtml = q.status === "Answered" 
                    ? `<div style="margin-top: 10px; padding: 10px; background: #e8f5e9; border-radius: 8px; color: var(--primary-dark);">
                           <strong>Reply:</strong> ${q.answer}
                       </div>`
                    : `<div style="margin-top: 10px; padding: 5px; color: var(--text-muted); font-size: 0.9rem;">
                           <em>Waiting for admin response...</em>
                       </div>`;

                qDiv.innerHTML = `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <strong style="color: var(--text-main);">Q: ${q.question}</strong>
                        <small style="color: var(--text-muted);">${new Date(q.date).toLocaleString()}</small>
                    </div>
                    ${answeredHtml}
                `;
                pqContainer.appendChild(qDiv);
            });
        } else {
            pqContainer.innerHTML = `<div class="empty-state"><span>💬</span><p>No questions asked yet.</p></div>`;
        }
"""
content = content.replace('// Medicines', js_queries + '\n        // Medicines')

# 5. Add submitQuery function
js_funcs = """
    async function submitQuery() {
        const input = document.getElementById("queryInput");
        const question = input.value.trim();
        if (!question) return alert("Please type a question.");

        const btn = document.getElementById("submitQueryBtn");
        btn.textContent = "Sending...";
        btn.disabled = true;

        try {
            const res = await fetch(`http://localhost:5001/api/patients/${patient._id}/queries`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question })
            });
            if (res.ok) {
                input.value = "";
                await fetchLatestData();
            } else {
                alert("Failed to submit question");
            }
        } catch (err) {
            console.error(err);
            alert("Error submitting question");
        } finally {
            btn.textContent = "Ask";
            btn.disabled = false;
        }
    }
"""
content = content.replace('async function fetchLatestData() {', js_funcs + '\n    async function fetchLatestData() {')

with open(file_path, "w") as f:
    f.write(content)
print("Updated patient-dashboard.html successfully.")
