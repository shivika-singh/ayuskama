const express = require("express");
const bcrypt = require("bcrypt");
const Therapist = require("../models/therapist");
const Session = require("../models/session");

const router = express.Router();

// Get all therapists
router.get("/", async (req, res) => {
    try {
        let therapists = await Therapist.find();
        if (therapists.length === 0) {
            const dummyTherapists = [
                { name: "Dr. Aditi Menon", therapy: "Panchakarma Therapy", phone: "+91 98765 11111" },
                { name: "Dr. Vikram Singh", therapy: "Abhyanga Massage", phone: "+91 87654 22222" },
                { name: "Dr. Sneha Nair", therapy: "Shirodhara", phone: "+91 76543 33333" },
                { name: "Dr. Rakesh Patil", therapy: "Detoxification", phone: "+91 65432 44444" },
                { name: "Dr. Maya Gupta", therapy: "Nasya Therapy", phone: "+91 54321 55555" }
            ];
            await Therapist.insertMany(dummyTherapists);
            therapists = await Therapist.find();
        }
        
        // Transform _id to id for frontend compatibility
        const mappedTherapists = therapists.map(t => ({
            id: t._id,
            name: t.name,
            therapy: t.therapy,
            phone: t.phone,
            username: t.username
        }));

        res.json(mappedTherapists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific therapist
router.get("/:id", async (req, res) => {
    try {
        const t = await Therapist.findById(req.params.id);
        if (!t) return res.status(404).json({ error: "Therapist not found" });
        res.json({
            id: t._id,
            name: t.name,
            therapy: t.therapy,
            phone: t.phone,
            username: t.username
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all sessions for a specific therapist
router.get("/:id/sessions", async (req, res) => {
    try {
        const sessions = await Session.find({ therapistId: req.params.id });
        const mappedSessions = sessions.map(s => ({
            id: s._id,
            therapistId: s.therapistId,
            patientId: s.patientId,
            patientName: s.patientName,
            patientAge: s.patientAge,
            patientGender: s.patientGender,
            roomNumber: s.roomNumber,
            treatment: s.treatment,
            startTime: s.startTime,
            endTime: s.endTime,
            specificMedicines: s.specificMedicines
        }));
        res.json(mappedSessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new session for a therapist
router.post("/:id/sessions", async (req, res) => {
    try {
        const newSession = new Session({
            ...req.body,
            therapistId: req.params.id
        });
        await newSession.save();
        res.status(201).json({
            id: newSession._id,
            ...req.body
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Therapist Login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const therapist = await Therapist.findOne({ username });
        if (!therapist) {
            return res.status(404).json({ message: "Invalid username or password" });
        }

        // Handle case where password is not set yet (unlikely after migration)
        if (!therapist.password) {
            return res.status(400).json({ message: "Credentials not initialized. Please contact admin." });
        }

        const isMatch = await bcrypt.compare(password, therapist.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        res.json({
            message: "Login successful",
            therapist: {
                id: therapist._id,
                name: therapist.name,
                username: therapist.username,
                therapy: therapist.therapy,
                phone: therapist.phone,
                passwordChanged: therapist.passwordChanged || false
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Therapist Reset Password (by validating phone number)
router.post("/reset-password", async (req, res) => {
    try {
        const { username, phone, newPassword } = req.body;
        if (!username || !phone || !newPassword) {
            return res.status(400).json({ message: "Username, phone number and new password are required" });
        }

        const therapist = await Therapist.findOne({ username });
        if (!therapist) {
            return res.status(404).json({ message: "Therapist username not found" });
        }

        // Clean phone numbers for a more robust comparison
        const cleanDBPhone = therapist.phone.replace(/[^0-9]/g, '');
        const cleanInputPhone = phone.replace(/[^0-9]/g, '');

        if (cleanDBPhone !== cleanInputPhone && therapist.phone !== phone) {
            return res.status(400).json({ message: "Phone number does not match registered phone number" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        therapist.password = hashedPassword;
        therapist.passwordChanged = true; // reset via self validation
        await therapist.save();

        res.json({ message: "Password reset successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Therapist update password directly (called when logged in or by admin)
router.put("/:id/password", async (req, res) => {
    try {
        const { newPassword, adminReset } = req.body;
        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }

        const therapist = await Therapist.findById(req.params.id);
        if (!therapist) {
            return res.status(404).json({ message: "Therapist not found" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        therapist.password = hashedPassword;
        therapist.passwordChanged = adminReset ? false : true;
        await therapist.save();

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
