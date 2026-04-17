// const Wallet = require('../models/Wallet');

// exports.getWallet = async (req, res) => {
//     const wallet = await Wallet.findOne({ userId: req.user._id });
//     if (!wallet) {
//         return res.status(404).json({ message: "Wallet not found!" });
//     }
//     res.status(200).json({ balance: wallet.balance });

// }

// exports.rechargeWallet = async (req, res) => {
//         const { amount } = req.body;

//         if(amount <= 0){
//             return res.status(400).json({ message: "Invalid recharge amount!" });
//         }

//         const wallet = await Wallet.findOne({ userId: req.user._id });

//         wallet.balance += amount;
//         await wallet.save();

//         res.status(200).json({ message: "Wallet recharged successfully", balance: wallet.balance });
// }

const Wallet = require("../models/Wallet");
const Vehicle = require("../models/Vehicle");
const User = require("../models/User");

exports.getWallet = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ userId: req.user._id });
        if (!wallet) return res.status(404).json({ message: "Wallet not found" });
        res.json({ balance: wallet.balance });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.rechargeWallet = async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });

        const wallet = await Wallet.findOne({ userId: req.user._id });
        if (!wallet) return res.status(404).json({ message: "Wallet not found" });

        wallet.balance += Number(amount);
        wallet.lastUpdated = new Date();
        await wallet.save();

        res.json({ message: "Wallet recharged", balance: wallet.balance });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllWallets = async (req, res) => {
    try {
        const wallets = await Wallet.find().populate("userId", "name phone email");
        res.json(wallets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.adminTopUp = async (req, res) => {
    try {
        const { plateNumber, amount } = req.body;
        if (!plateNumber || !amount || amount <= 0)
            return res.status(400).json({ message: "plateNumber and amount required" });

        const vehicle = await Vehicle.findOne({ plateNumber });
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

        const wallet = await Wallet.findOne({ userId: vehicle.userId });
        if (!wallet) return res.status(404).json({ message: "Wallet not found" });

        wallet.balance += Number(amount);
        wallet.lastUpdated = new Date();
        await wallet.save();

        res.json({ message: `Rs.${amount} added to ${plateNumber}`, balance: wallet.balance });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};