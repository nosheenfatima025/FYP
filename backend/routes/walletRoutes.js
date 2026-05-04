
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getWallet, rechargeWallet, getAllWallets, adminTopUp } = require("../controllers/walletController");

router.get("/all", protect, adminOnly, getAllWallets);
router.post("/recharge", protect, rechargeWallet);
router.post("/topup", protect, adminOnly, adminTopUp);
router.get("/all", getAllWallets);

module.exports = router;