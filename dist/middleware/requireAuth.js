import { verifyAccessToken } from "../utils/jwt.js";
export function requireAuth(req, res, next) {
    const authHeader = req.header("authorization");
    if (!authHeader) {
        console.warn("[AUTH] Missing Authorization header");
        return res.status(401).json({ error: "Unauthorized - Missing Authorization header" });
    }
    if (!authHeader.startsWith("Bearer ")) {
        console.warn("[AUTH] Invalid Authorization header format", { header: authHeader.substring(0, 20) + "..." });
        return res.status(401).json({ error: "Unauthorized - Invalid token format" });
    }
    const token = authHeader.slice("Bearer ".length).trim();
    if (!token) {
        console.warn("[AUTH] Empty token");
        return res.status(401).json({ error: "Unauthorized - Empty token" });
    }
    try {
        const payload = verifyAccessToken(token);
        req.user = { id: payload.sub, role: payload.role };
        console.info("[AUTH] Token verified", { userId: payload.sub, role: payload.role });
        return next();
    }
    catch (err) {
        console.warn("[AUTH] Token verification failed", { error: err.message });
        return res.status(401).json({ error: "Unauthorized - Invalid or expired token" });
    }
}
//# sourceMappingURL=requireAuth.js.map