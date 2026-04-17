const jwt = require("jsonwebtoken");

exports.refreshToken = (req, res, next) => {
    try {
        const prevToken = req.cookies?.jwt;
        if (!prevToken) {
            return res.status(403).json({ message: "No refresh token found" });
        }

        jwt.verify(prevToken, process.env.JWT_SECRET, (error, user) => {
            if (error) {
                console.log("Refresh token invalid:", error.message);
                return res.status(403).json({ message: "Invalid refresh token" });
            }

            // Create a new token
            const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: "30s",
            });

            res.cookie("jwt", newToken, {
                path: "/",
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                expires: new Date(Date.now() + 1000 * 30),
            });

            req.user = user;
            next();
        });
    } catch (error) {
        console.error("refreshToken error:", error);
        return res.status(500).json({ message: "Server error in refreshToken" });
    }
};
