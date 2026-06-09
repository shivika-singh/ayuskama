require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("./models/admin");

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB Atlas");

        const existingAdmin = await Admin.findOne({ username: "admin123" });
        if (existingAdmin) {
            console.log("Admin already exists!");
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("Admin@123", salt);

        const newAdmin = new Admin({ username: "admin123", password: hashedPassword });
        await newAdmin.save();

        console.log("Seeded initial admin: admin123 / Admin@123");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedAdmin();
