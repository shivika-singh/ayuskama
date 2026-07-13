const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
    patientId: String,
    name: String,
    age: Number,
    address: String,
    phone: String,
    treatmentPlan: String,
    roomNumber: String,
    password: { type: String, required: true },
    emergencyContact: String,
    allergens: String,
    disease: String,
    assignedTherapist: String,
    treatmentRoom: String,
    yogaTiming: String,
    treatmentTime: String,
    dosAndDonts: String,
    mealTimings: {
        breakfast: String,
        lunch: String,
        dinner: String
    },
    medicines: [{
        name: String,
        dosage: String,
        time: String
    }],
    checkInDate: Date,
    checkOutDate: Date,
    queries: [{
        question: String,
        answer: String,
        date: { type: Date, default: Date.now },
        status: { type: String, default: "Pending" }
    }],
    paymentMethod: { type: String, enum: ['pending', 'advanced', 'checkout'], default: 'pending' },
    dietPlan: String,
    treatmentProtocol: String,
    guardianName: String,
    gender: String,
    abhaNumber: { type: String, default: "NA" },
    abhaAddress: { type: String, default: "NA" },
    panel: { type: String, default: "NA" },
    policyNo: { type: String, default: "NA" },
    consultant: { type: String, default: "Dr. VINOD KUMAR" },
    department: { type: String, default: "AYURVEDA CONSULTANT" },
    uhid: String,
    ipdNo: String,
    symptoms: String,
    medicalHistory: String,
    dischargeType: { type: String, default: "DISCHARGE ON PATIENT REQUEST" },
    paidAmount: { type: Number, default: 0 },
    payments: [{
        amount: Number,
        method: String,
        transactionId: String,
        date: { type: Date, default: Date.now }
    }],
    dischargeSummary: {
        stayDuration: String,
        treatmentsReceived: [String],
        totalAmount: Number,
        paidAmount: Number,
        notes: String
    },
    feedback: {
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now }
    },
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Patient", PatientSchema);
