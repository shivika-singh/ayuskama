require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Therapist = require('./models/therapist');

async function updateTherapists() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to database for therapist migration.");

        const therapists = await Therapist.find();
        
        for (let t of therapists) {
            // Check if therapist already has a username
            if (!t.username) {
                // Generate clean username from name
                // Remove prefixes like Dr. Mr. Ms.
                let baseName = t.name.replace(/^(Dr\.|Mr\.|Ms\.)\s+/i, '');
                // Replace spaces and special characters with underscores, all lowercase
                let username = baseName.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
                
                // Ensure uniqueness
                let tempUsername = username;
                let counter = 1;
                while (await Therapist.findOne({ username: tempUsername })) {
                    counter++;
                    tempUsername = `${username}_${counter}`;
                }
                username = tempUsername;

                // Create default password: <username>_123
                const defaultPass = `${username}_123`;
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(defaultPass, salt);

                t.username = username;
                t.password = hashedPassword;
                
                await t.save();
                console.log(`Assigned Therapist "${t.name}" -> Username: "${username}", Temp Password: "${defaultPass}"`);
            } else {
                console.log(`Therapist "${t.name}" already has username: "${t.username}"`);
            }
        }

        console.log("Therapist migration completed successfully.");
        process.exit(0);
    } catch (e) {
        console.error("Migration failed:", e);
        process.exit(1);
    }
}

updateTherapists();
