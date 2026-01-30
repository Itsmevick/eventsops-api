import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
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
  } catch (err: any) {
    console.warn("[AUTH] Token verification failed", { error: err.message });
    return res.status(401).json({ error: "Unauthorized - Invalid or expired token" });
  }
}


