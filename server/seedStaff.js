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
            { name: "Dr. Neetu Singh", therapy: "Chief Doctor (Gynecology, Women's Health, Yoga)", phone: "+91 xxxxx xxxxx", bio: "With over 20 years of experience, Dr. Neetu Singh is a renowned Ayurvedic practitioner and yoga expert. Her expertise lies in Gynecology, Women’s Health Disorders, Yoga Philosophy, and Therapeutic Yoga. Dr. Neetu’s holistic approach combines the wisdom of Ayurveda with the power of yoga to address a wide range of health concerns." },
            { name: "Dr. Vinod Kumar", therapy: "Chief Doctor & CEO (Panchakarma Specialist)", phone: "+91 xxxxx xxxxx", bio: "Dr. Vinod Kumar, a renowned Ayurvedic physician and Panchakarma specialist, brings over 25 years of expertise in holistic healing. His dedication to natural wellness ensures personalized care and comprehensive treatment for each patient. Specializations: Ayurvedic Consultations, Panchakarma Therapies, Personalized Treatment Plans." },
            { name: "Ms. Anjali", therapy: "Yoga Teacher", phone: "+91 xxxxx xxxxx" }
        ];

        await Therapist.insertMany(staffList);
        console.log("Successfully seeded 9 real staff members.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedStaff();
