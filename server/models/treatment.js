const mongoose = require("mongoose");

const TreatmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    protocol: { type: String, required: true },
    defaultDosAndDonts: String,
    description: String,
    duration: String, // e.g., "60 mins"
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Treatment", TreatmentSchema);
