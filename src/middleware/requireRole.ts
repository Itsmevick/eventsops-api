import type { NextFunction, Request, Response } from "express";
import type { Role } from "../types/prisma-enums.js";

export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
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

