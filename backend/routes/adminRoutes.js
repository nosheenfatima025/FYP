const express = require("express");
const router = express.Router();
const { getDashboard, getUsers } = require("../controllers/adminController");
const Payment = require("../models/Payment");

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);

// ✅ Payments route add kiya
router.get("/payments", async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("userId", "name email")
            .populate("vehicleId", "plateNumber")
            .sort({ createdAt: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;