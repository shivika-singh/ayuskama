import os

file_path = "/Users/anshu/ayush care/client/patient-dashboard.html"

with open(file_path, "r") as f:
    content = f.read()

# Add Payment Modal and Discharge Modal at the bottom before scripts
modals = """
<!-- Payment Modal -->
<div id="paymentModal" class="modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; align-items: center; justify-content: center;">
    <div style="background: var(--card-bg); padding: 3rem; border-radius: 20px; text-align: center; max-width: 500px; width: 90%;">
        <h2 style="margin-bottom: 1rem; color: var(--primary-dark);">Select Payment Method</h2>
        <p style="margin-bottom: 2rem; color: var(--text-muted);">Welcome to Ayuskama! Please choose how you would like to handle your billing.</p>
        <button onclick="selectPayment('advanced')" class="nav-btn nav-btn-solid" style="width: 100%; margin-bottom: 1rem; padding: 15px; font-size: 1.1rem;">Advanced Payment (Now)</button>
        <button onclick="selectPayment('checkout')" class="nav-btn nav-btn-outline" style="width: 100%; padding: 15px; font-size: 1.1rem;">Total Payment at Checkout</button>
    </div>
</div>

<!-- Discharge Summary Modal -->
<div id="dischargeModal" class="modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; align-items: center; justify-content: center;">
    <div style="background: var(--card-bg); padding: 3rem; border-radius: 20px; max-width: 600px; width: 90%;">
        <h2 style="margin-bottom: 1rem; color: var(--primary-dark); text-align: center;">Discharge Summary & Invoice</h2>
        <div id="dischargeContent" style="margin-bottom: 2rem; line-height: 1.6;"></div>
        <button onclick="logout()" class="nav-btn nav-btn-solid" style="width: 100%; padding: 15px; font-size: 1.1rem;">Acknowledge & Logout</button>
    </div>
</div>
"""
content = content.replace("<!-- Navigation Bar -->", modals + "\n<!-- Navigation Bar -->")

# Add Checkout button to Navbar
checkout_btn = """
        <button onclick="checkoutPatient()" class="nav-btn" style="background: var(--accent); color: white; border: none;">Checkout</button>
        <button onclick="logout()" class="nav-btn nav-btn-outline">Logout</button>
"""
content = content.replace('<button onclick="logout()" class="nav-btn nav-btn-outline">Logout</button>', checkout_btn)

# Add Diet Plan to Routine Card
diet_plan_html = """
                <div class="meal-timing">
                    <span class="meal-name">🌙 Dinner</span>
                    <span class="meal-time" id="timeDinner">07:30 PM</span>
                </div>
                <div style="padding: 15px; background: #e3f0e8; margin-top: 10px;">
                    <strong style="color: var(--primary-dark);">Personalized Diet Plan:</strong>
                    <p id="ptDietPlan" style="margin-top: 5px; font-size: 0.95rem;">Follow general hospital meals.</p>
                </div>
"""
content = content.replace("""                <div class="meal-timing">
                    <span class="meal-name">🌙 Dinner</span>
                    <span class="meal-time" id="timeDinner">07:30 PM</span>
                </div>""", diet_plan_html)

# Add Protocol to Treatment Card
protocol_html = """
                <div class="treatment-badge" id="ptTreatment">Loading...</div>
                <div style="text-align: left; background: #fdfdfd; padding: 15px; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 15px;">
                    <strong style="color: var(--primary-dark); display: block; margin-bottom: 5px;">Treatment Protocol</strong>
                    <p id="ptProtocol" style="font-size: 0.95rem; color: var(--text-main);">Standard procedure.</p>
                </div>
"""
content = content.replace("""                <div class="treatment-badge" id="ptTreatment">Loading...</div>""", protocol_html)

# Update UI logic in Script
js_update_ui = """
        document.getElementById("ptTreatment").textContent = patientData.treatmentPlan || "General Consultation";
        document.getElementById("ptProtocol").textContent = patientData.treatmentProtocol || "No specific protocol assigned.";
        document.getElementById("ptDietPlan").textContent = patientData.dietPlan || "Follow general hospital meals.";

        // Handle Payment Modal on load
        if (patientData.paymentMethod === 'pending') {
            document.getElementById("paymentModal").style.display = "flex";
        }
"""
content = content.replace("""        document.getElementById("ptTreatment").textContent = patientData.treatmentPlan || "General Consultation";""", js_update_ui)

# Add payment and checkout JS functions
js_funcs = """
    async function selectPayment(method) {
        try {
            await fetch(`http://localhost:5001/api/patients/${patient._id}/payment-method`, {
                method: "PUT", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentMethod: method })
            });
            document.getElementById("paymentModal").style.display = "none";
            patient.paymentMethod = method;
            localStorage.setItem('patientData', JSON.stringify(patient));
        } catch(e) { console.error(e); }
    }

    async function checkoutPatient() {
        if (!confirm("Are you sure you want to checkout and generate your final summary?")) return;
        try {
            const res = await fetch(`http://localhost:5001/api/patients/${patient._id}/checkout`, {
                method: "POST"
            });
            const data = await res.json();
            if(res.ok) {
                const s = data.dischargeSummary;
                document.getElementById("dischargeContent").innerHTML = `
                    <p><strong>Stay Duration:</strong> ${s.stayDuration}</p>
                    <p><strong>Treatments:</strong> ${s.treatmentsReceived.join(", ")}</p>
                    <div style="margin: 15px 0; border-top: 1px dashed #ccc; padding-top: 15px;">
                        <p style="font-size: 1.2rem;"><strong>Total Amount:</strong> ₹${s.totalAmount}</p>
                        <p style="color: var(--primary-dark);"><strong>Paid:</strong> ₹${s.paidAmount}</p>
                        <p style="color: #d84b5b;"><strong>Due:</strong> ₹${s.totalAmount - s.paidAmount}</p>
                    </div>
                    <p style="font-style: italic; color: var(--text-muted);">${s.notes}</p>
                `;
                document.getElementById("dischargeModal").style.display = "flex";
            } else { alert(data.message); }
        } catch(e) { console.error(e); }
    }

    function logout() {
"""
content = content.replace("""    function logout() {""", js_funcs)

with open(file_path, "w") as f:
    f.write(content)

print("Updated patient-dashboard.html")
