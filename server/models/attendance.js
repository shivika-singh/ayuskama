const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
    therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true },
    therapistName: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    checkIn: { type: Date },
    checkOut: { type: Date }
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
