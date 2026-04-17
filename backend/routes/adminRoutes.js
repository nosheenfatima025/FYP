

const express = require("express");
const router = express.Router();
const { getDashboard, getUsers } = require("../controllers/adminController");

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);

module.exports = router;