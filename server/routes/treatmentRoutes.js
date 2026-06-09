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

module.exports = router;
