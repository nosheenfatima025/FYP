const jwt = require("jsonwebtoken");

const VerifyToken = (req, res, next) => {
    try {
        const cookies = req.headers.cookie;
        if (!cookies) {
            return res.status(401).json({ message: "No token found" });
        }

        const token = cookies.split("=")[1];
        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }

        jwt.verify(String(token), process.env.JWT_SECRET, (error, user) => {
            if (error) {
                return res.status(403).json({ message: "Invalid token" });
            }
            req.id = user.id;
            next();
        });
    } catch (error) {
        console.error("VerifyToken error:", error);
        res.status(500).json({ message: "Server error in VerifyToken" });
    }
};

module.exports = VerifyToken;
