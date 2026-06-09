require('dotenv').config();
const mongoose = require('mongoose');
const Patient = require('./models/patient');

async function updateExistingIds() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const patients = await Patient.find({ patientId: { $exists: false } });
        
        for (let p of patients) {
            const roomNum = p.roomNumber || Math.floor(100 + Math.random() * 900);
            p.patientId = "ayush_" + roomNum;
            await p.save();
            console.log("Updated patient:", p.name, "to ID:", p.patientId);
        }

        // Also fix any AYUR- ones if they exist
        const oldPatients = await Patient.find({ patientId: { $regex: /^AYUR-/ } });
        for (let p of oldPatients) {
            const roomNum = p.roomNumber || Math.floor(100 + Math.random() * 900);
            p.patientId = "ayush_" + roomNum;
            await p.save();
            console.log("Updated patient:", p.name, "to ID:", p.patientId);
        }

        console.log("All patients updated successfully");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

updateExistingIds();
