const express = require("express");
const router = express.Router();
const Treatment = require("../models/treatment");

// Get all treatments
router.get("/", async (req, res) => {
    try {
        const treatments = await Treatment.find();
        res.json(treatments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new predefined treatment
router.post("/", async (req, res) => {
    try {
        const treatment = new Treatment(req.body);
        await treatment.save();
        res.status(201).json(treatment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an existing predefined treatment
router.put("/:id", async (req, res) => {
    try {
        const treatment = await Treatment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!treatment) {
            return res.status(404).json({ error: "Treatment not found" });
        }
        res.json(treatment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a predefined treatment
router.delete("/:id", async (req, res) => {
    try {
        const treatment = await Treatment.findByIdAndDelete(req.params.id);
        if (!treatment) {
            return res.status(404).json({ error: "Treatment not found" });
        }
        res.json({ message: "Treatment deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
