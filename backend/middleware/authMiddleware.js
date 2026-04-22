
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) return res.status(401).json({ message: "Not authorized, token missing" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role === "Admin") {
            req.admin = await Admin.findById(decoded.id).select("-passwordHash");
        } else {
            req.user = await User.findById(decoded.id).select("-passwordHash");
        }
        if (!req.user && !req.admin) return res.status(401).json({ message: "User not found" });
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

exports.adminOnly = (req, res, next) => {
    if (!req.admin) return res.status(403).json({ message: "Access denied. Admin only." });
    next();
};