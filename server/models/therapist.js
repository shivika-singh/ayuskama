const mongoose = require("mongoose");

const therapistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    therapy: { type: String, required: true },
    phone: { type: String, required: true },
    bio: { type: String }
});

module.exports = mongoose.model("Therapist", therapistSchema);
