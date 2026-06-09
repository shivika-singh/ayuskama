require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Patient = require('./models/patient');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const patients = await Patient.find();
    for (let p of patients) {
        const namePart = p.name ? p.name.substring(0, 3).toLowerCase() : "usr";
        const roomPart = p.roomNumber || "000";
        const rawPassword = namePart + "-" + roomPart;
        
        const salt = await bcrypt.genSalt(10);
        p.password = await bcrypt.hash(rawPassword, salt);
        await p.save();
        console.log("Reset password for", p.name, "to", rawPassword);
    }
    process.exit(0);
});
