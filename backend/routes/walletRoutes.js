
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getWallet, rechargeWallet, getAllWallets, adminTopUp } = require("../controllers/walletController");

router.get("/", protect, getWallet);
router.post("/recharge", protect, rechargeWallet);
router.get("/all", getAllWallets);
router.post("/topup", adminTopUp);

module.exports = router;