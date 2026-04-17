const express = require("express");
const router = express.Router();

// Simple in-memory store (ya MongoDB model bana sakte ho)
let rates = [
    { type: "car", label: "Car", icon: "🚗", hourly: 50, minCharge: 10, dailyMax: 400, monthly: 2400, grace: 15, enabled: true, colorClass: "car" },
    { type: "motorcycle", label: "Motorcycle", icon: "🏍️", hourly: 25, minCharge: 5, dailyMax: 200, monthly: 1200, grace: 10, enabled: true, colorClass: "motorcycle" },
    { type: "suv", label: "SUV / 4×4", icon: "🚙", hourly: 80, minCharge: 20, dailyMax: 640, monthly: 4800, grace: 15, enabled: true, colorClass: "suv" },
    { type: "truck", label: "Truck / Van", icon: "🚐", hourly: 80, minCharge: 20, dailyMax: 640, monthly: 4800, grace: 15, enabled: true, colorClass: "truck" },
    { type: "rickshaw", label: "Rickshaw", icon: "🛺", hourly: 30, minCharge: 8, dailyMax: 240, monthly: 1800, grace: 10, enabled: true, colorClass: "rickshaw" },
];
let rateHistory = [];

router.get("/", (req, res) => res.json(rates));

router.put("/:type", (req, res) => {
    const idx = rates.findIndex(r => r.type === req.params.type);
    if (idx === -1) return res.status(404).json({ message: "Rate not found" });
    const old = { ...rates[idx] };
    rates[idx] = { ...rates[idx], ...req.body };
    rateHistory.unshift({
        id: Date.now(), type: req.params.type, label: rates[idx].label,
        icon: rates[idx].icon, oldHourly: old.hourly, newHourly: rates[idx].hourly,
        changedAt: new Date().toISOString(), changedBy: "Admin"
    });
    res.json(rates[idx]);
});

router.post("/", (req, res) => {
    const existing = rates.find(r => r.type === req.body.type);
    if (existing) return res.status(400).json({ message: "Rate type already exists" });
    rates.push({ ...req.body, enabled: true });
    res.json(rates[rates.length - 1]);
});

router.get("/history/all", (req, res) => res.json(rateHistory));

module.exports = router;