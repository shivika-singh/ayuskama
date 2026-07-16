const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    therapistId: { type: mongoose.Schema.Types.ObjectId, ref: "Therapist", required: true },
    patientId: { type: String },
    patientName: { type: String, required: true },
    patientAge: { type: Number },
    patientGender: { type: String },
    roomNumber: { type: String },
    treatment: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    specificMedicines: { type: String }
});

module.exports = mongoose.model("Session", sessionSchema);
