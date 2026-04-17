const express = require("express");
const router = express.Router();
const multer = require("multer");
const { vehicleEntry, vehicleExit, getAllLogs, detectPlateOnly } = require("../controllers/entryExitController");

// Multer - memory storage (no file saved to disk)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

router.post("/entry", upload.single("image"), vehicleEntry);
router.post("/exit", upload.single("image"), vehicleExit);
router.post("/detect", upload.single("image"), detectPlateOnly);
router.get("/logs", getAllLogs);

module.exports = router;