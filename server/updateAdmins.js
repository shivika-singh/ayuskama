require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("./models/admin");

async function updateAdmins() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB Atlas");

        // Delete old admin
        await Admin.deleteMany({ username: "admin123" });
        console.log("Deleted admin123");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("Ayuskama@123", salt);

        const admins = ["dr_neetu", "dr_vinod", "reception"];

        for (let user of admins) {
            const exists = await Admin.findOne({ username: user });
            if (!exists) {
                const newAdmin = new Admin({ username: user, password: hashedPassword });
                await newAdmin.save();
                console.log(`Created admin: ${user}`);
            } else {
                console.log(`Admin ${user} already exists.`);
            }
        }

        console.log("Admin accounts updated.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

updateAdmins();
