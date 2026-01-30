function sanitizeBody(body) {
    if (!body || typeof body !== "object")
        return body;
    const copy = { ...body };
    if ("password" in copy)
        copy.password = "[REDACTED]";
    return copy;
}
export function requestLogger(req, res, next) {
    const startedAt = Date.now();
    const path = req.originalUrl;
    // Keep it minimal but useful; add body for auth routes (sanitized)
    if (path.startsWith("/api/auth")) {
        const authHeader = req.header("authorization");
        const hasAuth = authHeader ? "Bearer ***" : "none";
        console.info(`[REQ] ${req.method} ${path}`, {
            body: sanitizeBody(req.body),
            auth: hasAuth
        });
    }
    else {
        console.info(`[REQ] ${req.method} ${path}`);
    }
    res.on("finish", () => {
        const ms = Date.now() - startedAt;
        console.info(`[RES] ${req.method} ${path} -> ${res.statusCode} (${ms}ms)`);
    });
    next();
}
//# sourceMappingURL=requestLogger.js.map