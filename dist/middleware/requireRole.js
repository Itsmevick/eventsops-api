export function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!allowedRoles.includes(req.user.role)) {
            console.warn("[RBAC] Forbidden", {
                userId: req.user.id,
                userRole: req.user.role,
                allowedRoles
            });
            return res.status(403).json({ error: "Forbidden" });
        }
        next();
    };
}
//# sourceMappingURL=requireRole.js.map