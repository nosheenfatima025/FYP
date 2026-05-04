const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getWallet, rechargeWallet, getAllWallets, adminTopUp } = require("../controllers/walletController");

router.get("/", protect, getWallet);
router.get("/all", protect, adminOnly, getAllWallets);
router.post("/recharge", protect, rechargeWallet);
router.post("/topup", protect, adminOnly, adminTopUp);

module.exports = router;