const express = require("express");
const router = express.Router();
const Attendance = require("../models/attendance");

// Check In
router.post("/check-in", async (req, res) => {
    try {
        const { therapistId, therapistName } = req.body;
        if (!therapistId || !therapistName) {
            return res.status(400).json({ message: "Therapist ID and name are required" });
        }

        const date = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
        
        // Check if already checked in today
        const existing = await Attendance.findOne({ therapistId, date });
        if (existing) {
            return res.status(400).json({ message: "Already checked in for today" });
        }

        const record = new Attendance({
            therapistId,
            therapistName,
            date,
            checkIn: new Date()
        });
        await record.save();

        res.json({ message: "Checked in successfully", record });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Check Out
router.post("/check-out", async (req, res) => {
    try {
        const { therapistId } = req.body;
        if (!therapistId) {
            return res.status(400).json({ message: "Therapist ID is required" });
        }

        const date = new Date().toLocaleDateString('en-CA');
        
        const record = await Attendance.findOne({ therapistId, date });
        if (!record) {
            return res.status(400).json({ message: "No check-in record found for today. Please check in first." });
        }

        if (record.checkOut) {
            return res.status(400).json({ message: "Already checked out for today" });
        }

        record.checkOut = new Date();
        await record.save();

        res.json({ message: "Checked out successfully", record });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get today's attendance status for a therapist
router.get("/status/:therapistId", async (req, res) => {
    try {
        const date = new Date().toLocaleDateString('en-CA');
        const record = await Attendance.findOne({ therapistId: req.params.therapistId, date });
        
        res.json({
            checkedIn: !!record,
            checkInTime: record ? record.checkIn : null,
            checkedOut: !!(record && record.checkOut),
            checkOutTime: record ? record.checkOut : null
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all attendance logs for Admin
router.get("/admin", async (req, res) => {
    try {
        const logs = await Attendance.find().sort({ date: -1, checkIn: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get attendance logs for a specific therapist
router.get("/therapist/:therapistId", async (req, res) => {
    try {
        const logs = await Attendance.find({ therapistId: req.params.therapistId }).sort({ date: -1, checkIn: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
