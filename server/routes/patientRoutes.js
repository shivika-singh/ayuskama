const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Patient = require("../models/patient");

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_T9mqUCv06QmVeD',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'tJEcNFJvnnoFP37SfbConMak'
});

router.post("/register", async (req, res) => {
    try {
        const patientData = req.body;
        // Generate a patientId if none is provided, ensuring uniqueness
        if (patientData.patientId) {
            const existing = await Patient.findOne({ patientId: patientData.patientId });
            if (existing) {
                return res.status(400).json({ message: `Patient ID ${patientData.patientId} is already registered.` });
            }
        } else {
            const roomNum = patientData.roomNumber || Math.floor(100 + Math.random() * 900);
            const baseId = "ayush_" + roomNum;
            let tempId = baseId;
            let counter = 1;
            while (await Patient.findOne({ patientId: tempId })) {
                counter++;
                tempId = `${baseId}_${counter}`;
            }
            patientData.patientId = tempId;
        }
        
        // Auto-generate password: first 3 letters of name + "-" + roomNumber
        const namePart = patientData.name ? patientData.name.substring(0, 3).toLowerCase() : "usr";
        const roomPart = patientData.roomNumber || "000";
        patientData.password = namePart + "-" + roomPart;

        // Hash the patient's password
        const salt = await bcrypt.genSalt(10);
        patientData.password = await bcrypt.hash(patientData.password, salt);
        
        const count = await Patient.countDocuments();
        const checkInDateVal = patientData.checkInDate ? new Date(patientData.checkInDate) : new Date();
        const year = checkInDateVal.getFullYear();
        if (!patientData.uhid) {
            patientData.uhid = `U-${count + 1}/${year}`;
        }
        if (!patientData.ipdNo) {
            patientData.ipdNo = `IP-${count + 1}/${year}`;
        }

        const patient = new Patient(patientData);
        await patient.save();
        res.json({ message: "Patient Registered Successfully", patientId: patient.patientId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all patient feedbacks
router.get("/feedbacks", async (req, res) => {
    try {
        const patients = await Patient.find({ "feedback.rating": { $exists: true, $ne: null } })
            .select("name feedback checkOutDate")
            .sort({ "feedback.date": -1 });
        
        const feedbacks = patients.map(p => ({
            name: p.name,
            rating: p.feedback.rating,
            comment: p.feedback.comment,
            date: p.feedback.date || p.checkOutDate || p.createdAt
        }));
        
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });
        res.json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id/medicines", async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });
        
        patient.medicines = req.body.medicines;
        await patient.save();
        
        res.json({ message: "Medicines updated successfully", patient });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id/routine", async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });
        
        if (req.body.assignedTherapist !== undefined) patient.assignedTherapist = req.body.assignedTherapist;
        if (req.body.treatmentRoom !== undefined) patient.treatmentRoom = req.body.treatmentRoom;
        if (req.body.yogaTiming !== undefined) patient.yogaTiming = req.body.yogaTiming;
        if (req.body.treatmentTime !== undefined) patient.treatmentTime = req.body.treatmentTime;
        if (req.body.dosAndDonts !== undefined) patient.dosAndDonts = req.body.dosAndDonts;
        if (req.body.mealTimings !== undefined) patient.mealTimings = req.body.mealTimings;
        if (req.body.treatmentPlan !== undefined) patient.treatmentPlan = req.body.treatmentPlan;
        if (req.body.checkInDate !== undefined) patient.checkInDate = req.body.checkInDate;
        if (req.body.checkOutDate !== undefined) patient.checkOutDate = req.body.checkOutDate;
        if (req.body.dietPlan !== undefined) patient.dietPlan = req.body.dietPlan;
        if (req.body.treatmentProtocol !== undefined) patient.treatmentProtocol = req.body.treatmentProtocol;

        if (req.body.guardianName !== undefined) patient.guardianName = req.body.guardianName;
        if (req.body.gender !== undefined) patient.gender = req.body.gender;
        if (req.body.abhaNumber !== undefined) patient.abhaNumber = req.body.abhaNumber;
        if (req.body.abhaAddress !== undefined) patient.abhaAddress = req.body.abhaAddress;
        if (req.body.panel !== undefined) patient.panel = req.body.panel;
        if (req.body.policyNo !== undefined) patient.policyNo = req.body.policyNo;
        if (req.body.consultant !== undefined) patient.consultant = req.body.consultant;
        if (req.body.department !== undefined) patient.department = req.body.department;
        if (req.body.symptoms !== undefined) patient.symptoms = req.body.symptoms;
        if (req.body.medicalHistory !== undefined) patient.medicalHistory = req.body.medicalHistory;
        if (req.body.disease !== undefined) patient.disease = req.body.disease;
        if (req.body.age !== undefined) patient.age = req.body.age;
        if (req.body.phone !== undefined) patient.phone = req.body.phone;
        if (req.body.emergencyContact !== undefined) patient.emergencyContact = req.body.emergencyContact;
        if (req.body.address !== undefined) patient.address = req.body.address;
        if (req.body.roomNumber !== undefined) patient.roomNumber = req.body.roomNumber;

        await patient.save();
        res.json({ message: "Routine updated successfully", patient });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Post a new query (from Patient Dashboard)
router.post("/:id/queries", async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });
        
        patient.queries.push({ question: req.body.question, status: "Pending" });
        await patient.save();
        res.json({ message: "Query submitted successfully", patient });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Answer a query (from Admin Dashboard)
router.put("/:id/queries/:queryId", async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });
        
        const query = patient.queries.id(req.params.queryId);
        if (!query) return res.status(404).json({ message: "Query not found" });

        query.answer = req.body.answer;
        query.status = "Answered";
        
        await patient.save();
        res.json({ message: "Query answered successfully", patient });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Patient login
router.post("/login", async (req, res) => {
    try {
        const { patientId, password } = req.body;
        if (!patientId || !password) {
            return res.status(400).json({ message: "Patient ID and Password are required" });
        }

        // We lookup by _id if it's a mongo ID, or by a custom patientId field.
        // Let's assume patientId here is the `_id` string for now since our UI passes the _id.
        // Wait, the client used `patientId`. Let's support both `_id` and custom `patientId`.
        let patient;
        if (patientId.startsWith("ayush_") || patientId.startsWith("AYUR-")) {
            // Sort by createdAt descending to fetch the most recent patient in that room
            patient = await Patient.findOne({ patientId: patientId }).sort({ createdAt: -1 });
        } else {
            try {
                patient = await Patient.findById(patientId);
            } catch (e) {
                patient = null;
            }
        }

        if (!patient) {
            return res.status(404).json({ message: "Invalid Patient ID or Password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Patient ID or Password" });
        }

        if (patient.status === 'checked-out') {
            return res.status(403).json({ message: "Patient has been checked out." });
        }

        res.json({ message: "Login successful", patient });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Select payment method (First login)
router.put("/:id/payment-method", async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });
        
        patient.paymentMethod = req.body.paymentMethod;
        await patient.save();
        res.json({ message: "Payment method updated", patient });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit payment transaction
router.post("/:id/pay", async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        const amount = Number(req.body.amount);
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: "Invalid payment amount" });
        }

        const transactionId = "TXN-" + Math.random().toString(36).substring(2, 10).toUpperCase();
        
        patient.payments.push({
            amount,
            method: req.body.method || "Card",
            transactionId,
            date: new Date()
        });

        patient.paidAmount = (patient.paidAmount || 0) + amount;
        await patient.save();

        res.json({ message: "Payment processed successfully", patient, transactionId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Razorpay Order
router.post("/:id/razorpay-order", async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        const amount = Number(req.body.amount);
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: "Invalid order amount" });
        }

        const options = {
            amount: Math.round(amount * 100), // in paise
            currency: "INR",
            receipt: `receipt_order_${patient._id.toString().substring(0, 10)}`,
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);
        res.json({ order, keyId: razorpay.key_id });
    } catch (err) {
        console.error("Razorpay order creation error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Verify Razorpay Signature and log payment
router.post("/:id/razorpay-verify", async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

        // Generate expected signature
        const hmac = crypto.createHmac("sha256", razorpay.key_secret);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const expectedSignature = hmac.digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Payment verification failed. Signature mismatch." });
        }

        // Add payment transaction to list
        const paymentAmount = Number(amount);
        patient.payments.push({
            amount: paymentAmount,
            method: "Razorpay (Online)",
            transactionId: razorpay_payment_id,
            date: new Date()
        });

        patient.paidAmount = (patient.paidAmount || 0) + paymentAmount;
        await patient.save();

        res.json({ message: "Payment verified and recorded successfully", patient, transactionId: razorpay_payment_id });
    } catch (err) {
        console.error("Razorpay verification error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Checkout and generate discharge summary
router.post("/:id/checkout", async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        // Calculate stay duration
        const checkIn = patient.checkInDate ? new Date(patient.checkInDate) : patient.createdAt;
        const checkOut = new Date();
        const diffTime = Math.abs(checkOut - checkIn);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // at least 1 day
        
        const totalAmount = diffDays * 5000; // 5000 per day cost
        const paidAmount = patient.paidAmount || 0;
        const outstanding = totalAmount - paidAmount;

        if (outstanding > 0) {
            return res.status(400).json({ 
                message: `Checkout blocked. Outstanding fees of ₹${outstanding} must be paid before discharge.` 
            });
        }

        const { rating, comment } = req.body;
        if (!rating || !comment || comment.trim() === "") {
            return res.status(400).json({ 
                message: "Feedback is mandatory. Please provide a rating and comment before checking out." 
            });
        }

        patient.feedback = {
            rating: Number(rating),
            comment: comment.trim(),
            date: new Date()
        };

        patient.dischargeSummary = {
            stayDuration: `${diffDays} Days`,
            treatmentsReceived: [patient.treatmentPlan || "General Wellness", patient.treatmentProtocol || ""].filter(Boolean),
            totalAmount: totalAmount,
            paidAmount: paidAmount,
            notes: "Thank you for choosing Ayuskama. Please follow the diet plan and dos/donts."
        };

        patient.status = 'checked-out';
        patient.checkOutDate = checkOut;
        await patient.save();
        
        res.json({ message: "Checkout successful", dischargeSummary: patient.dischargeSummary, patient });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
