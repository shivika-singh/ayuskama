const mongoose = require("mongoose");

const therapistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    therapy: { type: String, required: true },
    phone: { type: String, required: true },
    username: { type: String, unique: true, sparse: true },
    password: { type: String },
    passwordChanged: { type: Boolean, default: false },
    bio: { type: String }
});

module.exports = mongoose.model("Therapist", therapistSchema);
