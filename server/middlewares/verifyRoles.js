const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.role) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const rolesArray = [...allowedRoles];
        const result = rolesArray.includes(req.role);

        if (!result) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        next();
    }
};

module.exports = verifyRoles;