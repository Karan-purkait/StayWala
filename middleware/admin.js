module.exports = {
    adminRequired: (req, res, next) => {
        if (req.user && req.user.isAdmin) return next();
        res.status(403).send("Admin access required");
    }
};