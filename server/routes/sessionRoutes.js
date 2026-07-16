const express = require("express");
const Session = require("../models/session");
const Therapist = require("../models/therapist");

const router = express.Router();

// Get sessions for a specific patientId
router.get("/patient/:patientId", async (req, res) => {
    try {
        const sessions = await Session.find({ patientId: req.params.patientId }).populate("therapistId");
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a session
router.put("/:id", async (req, res) => {
    try {
        const updatedSession = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({
            id: updatedSession._id,
            therapistId: updatedSession.therapistId,
            patientId: updatedSession.patientId,
            patientName: updatedSession.patientName,
            patientAge: updatedSession.patientAge,
            patientGender: updatedSession.patientGender,
            roomNumber: updatedSession.roomNumber,
            treatment: updatedSession.treatment,
            startTime: updatedSession.startTime,
            endTime: updatedSession.endTime,
            specificMedicines: updatedSession.specificMedicines
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a session
router.delete("/:id", async (req, res) => {
    try {
        await Session.findByIdAndDelete(req.params.id);
        res.json({ message: "Session deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
