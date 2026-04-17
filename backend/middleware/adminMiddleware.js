exports.adminOnly = (req, res, next) => {
    if (!req.admin) {
        return res
            .status(403)
            .json({ message: "Access denied. Admin only route." });
    }

    next();
};
