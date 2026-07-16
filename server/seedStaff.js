require("dotenv").config();
const mongoose = require("mongoose");
const Therapist = require("./models/therapist");

async function seedStaff() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB Atlas");

        // Clear existing therapists
        await Therapist.deleteMany({});
        console.log("Cleared existing therapists");

        const staffList = [
            { name: "Ms. Aruna", therapy: "Ayurveda Therapist", phone: "+91 xxxxx xxxxx" },
            { name: "Mr. Rohan", therapy: "Ayurveda Therapist", phone: "+91 xxxxx xxxxx" },
            { name: "Ms. Shalu", therapy: "Ayurveda Therapist", phone: "+91 xxxxx xxxxx" },
            { name: "Ms. Kritika", therapy: "Ayurveda Therapist", phone: "+91 xxxxx xxxxx" },
            { name: "Mr. Rohan Singh", therapy: "Ayurveda Therapist", phone: "+91 xxxxx xxxxx" },
            { name: "Narendra", therapy: "Ayurveda Chef", phone: "+91 xxxxx xxxxx" },
            { name: "Ms. Anjali", therapy: "Yoga Teacher", phone: "+91 xxxxx xxxxx" }
        ];

        const bcrypt = require("bcrypt");
        const seededStaff = [];
        const seenUsernames = new Set();

        for (let item of staffList) {
            let baseName = item.name.replace(/^(Dr\.|Mr\.|Ms\.)\s+/i, '');
            let username = baseName.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
            let tempUsername = username;
            let counter = 1;
            while (seenUsernames.has(tempUsername)) {
                counter++;
                tempUsername = `${username}_${counter}`;
            }
            username = tempUsername;
            seenUsernames.add(username);

            const defaultPass = `${username}_123`;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(defaultPass, salt);

            seededStaff.push({
                ...item,
                username,
                password: hashedPassword
            });
        }

        await Therapist.insertMany(seededStaff);
        console.log("Successfully seeded 9 real staff members with credentials.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedStaff();
