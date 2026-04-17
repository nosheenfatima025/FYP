
const Vehicle = require("../models/Vehicle");
const EntryExitLog = require("../models/EntryExitLog");
const FraudLog = require("../models/FraudLog");
const Payment = require("../models/Payment");
const Wallet = require("../models/Wallet");
const User = require("../models/User");

const TOTAL_SLOTS = 50;

exports.getDashboard = async (req, res) => {
    try {
        const totalVehicles = await Vehicle.countDocuments();
        const currentlyParked = await EntryExitLog.countDocuments({ status: "IN" });
        const fraudAlerts = await FraudLog.countDocuments({ resolved: false });

        // Today revenue
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const revenueData = await Payment.aggregate([
            { $match: { createdAt: { $gte: today }, status: "SUCCESS" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const todayRevenue = revenueData[0]?.total || 0;
        const occupancy = Math.round((currentlyParked / TOTAL_SLOTS) * 100);

        // Recent activities
        const recentLogs = await EntryExitLog.find()
            .sort({ createdAt: -1 }).limit(10)
            .populate({ path: "vehicleId", select: "plateNumber userId" });

        const activities = recentLogs.map(log => ({
            type: log.status === "IN" ? "entry" : "exit",
            plate: log.vehicleId?.plateNumber || "Unknown",
            text: `${log.vehicleId?.plateNumber || "Unknown"} ${log.status === "IN" ? "entered" : "exited"} parking`,
            time: log.createdAt
        }));

        // Currently parked
        const parkedLogs = await EntryExitLog.find({ status: "IN" })
            .populate({ path: "vehicleId", select: "plateNumber userId" })
            .sort({ entryTime: -1 }).limit(5);

        const parkedNow = await Promise.all(parkedLogs.map(async log => {
            const mins = Math.floor((Date.now() - new Date(log.entryTime)) / 60000);
            const owner = log.vehicleId?.userId
                ? (await User.findById(log.vehicleId.userId).select("name"))?.name || "Unknown"
                : "Unknown";
            return {
                plate: log.vehicleId?.plateNumber || "Unknown",
                owner,
                duration: `${Math.floor(mins / 60)}h ${mins % 60}m`
            };
        }));

        // Low wallets
        const lowWalletDocs = await Wallet.find({ balance: { $lt: 200 } })
            .populate("userId", "name").limit(5);

        const lowWallets = await Promise.all(lowWalletDocs.map(async w => {
            const vehicle = await Vehicle.findOne({ userId: w.userId?._id }).select("plateNumber");
            return {
                plate: vehicle?.plateNumber || "Unknown",
                owner: w.userId?.name || "Unknown",
                balance: w.balance
            };
        }));

        // Top vehicles
        const topAgg = await Payment.aggregate([
            { $match: { status: "SUCCESS" } },
            { $group: { _id: "$vehicleId", total: { $sum: "$amount" } } },
            { $sort: { total: -1 } }, { $limit: 3 },
            { $lookup: { from: "vehicles", localField: "_id", foreignField: "_id", as: "vehicle" } },
            { $unwind: { path: "$vehicle", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: "users", localField: "vehicle.userId", foreignField: "_id", as: "user" } },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }
        ]);

        const topVehicles = topAgg.map(t => ({
            plate: t.vehicle?.plateNumber || "Unknown",
            owner: t.user?.name || "Unknown",
            amt: t.total
        }));

        // Fraud list
        const fraudList = (await FraudLog.find({ resolved: false })
            .sort({ detectedAt: -1 }).limit(3))
            .map(f => ({ msg: f.reason, plate: f.numberPlate, sev: "Critical", time: f.detectedAt }));

        res.json({
            totalVehicles, currentlyParked, todayRevenue,
            fraudAlerts, occupancy,
            available: Math.max(TOTAL_SLOTS - currentlyParked, 0),
            activities, parkedNow, lowWallets, topVehicles, fraudList
        });
    } catch (err) {
        console.error("Dashboard error:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};