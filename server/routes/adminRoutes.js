const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");

// Register a new admin (you can remove this route in production if you manually seed an admin)
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({ username, password: hashedPassword });
        await newAdmin.save();

        res.json({ message: "Admin registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(404).json({ message: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        res.json({ message: "Login successful", username: admin.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Reset Password (directly via username verification)
router.post("/reset-password", async (req, res) => {
    try {
        const { username, newPassword } = req.body;
        if (!username || !newPassword) {
            return res.status(400).json({ message: "Username and new password are required" });
        }

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(404).json({ message: "Admin username not found" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        admin.password = hashedPassword;
        await admin.save();

        res.json({ message: "Password reset successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
