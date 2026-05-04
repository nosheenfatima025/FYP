
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { addVehicle, getAllVehicles, getMyVehicles, deactivateVehicle } = require("../controllers/vehicleController");
router.get("/all", protect, adminOnly, getAllVehicles);
router.get("/my", protect, getMyVehicles);
router.post("/add", addVehicle);
router.put("/:id/deactivate", protect, deactivateVehicle);

module.exports = router;