const Wallet = require("../models/Wallet");
const Vehicle = require("../models/Vehicle");

exports.getWallet = async (req, res) => {
    try {
        let wallet = await Wallet.findOne({ userId: req.user._id });

        // 🔥 auto create wallet
        if (!wallet) {
            wallet = await Wallet.create({
                userId: req.user._id,
                balance: 0
            });
        }

        res.json({ balance: wallet.balance });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.rechargeWallet = async (req, res) => {
    try {
        let { amount } = req.body;

        amount = Number(amount);

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        const wallet = await Wallet.findOne({ userId: req.user._id });

        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }

        wallet.balance += amount;
        wallet.lastUpdated = new Date();

        await wallet.save();

        res.json({
            message: "Wallet recharged",
            balance: wallet.balance
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllWallets = async (req, res) => {
    try {
        const wallets = await Wallet.find()
            .populate("userId", "name phone email")
            .sort({ updatedAt: -1 });

        res.json(wallets);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.adminTopUp = async (req, res) => {
    try {
        let { plateNumber, amount } = req.body;

        amount = Number(amount);

        if (!plateNumber || !amount || amount <= 0) {
            return res.status(400).json({
                message: "plateNumber and valid amount required"
            });
        }

        // 🔒 Only active vehicle allowed
        const vehicle = await Vehicle.findOne({
            plateNumber,
            isActive: true
        });

        if (!vehicle) {
            return res.status(404).json({
                message: "Active vehicle not found"
            });
        }

        const wallet = await Wallet.findOne({ userId: vehicle.userId });

        if (!wallet) {
            return res.status(404).json({
                message: "Wallet not found"
            });
        }

        wallet.balance += amount;
        wallet.lastUpdated = new Date();

        await wallet.save();

        res.json({
            message: `Rs.${amount} added to ${plateNumber}`,
            balance: wallet.balance
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};