import type { Request, Response } from "express";
import { listUsers } from "../services/users.service.js";

/**
 * GET /api/users
 * List all users (ADMIN and ORGANIZER only)
 */
export async function list(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Only ADMIN and ORGANIZER can list users
    if (req.user.role !== "ADMIN" && req.user.role !== "ORGANIZER") {
      return res.status(403).json({ error: "Forbidden: Only admins and organizers can view users" });
    }

    const users = await listUsers(req.user.role);
    return res.json({ data: users });
  } catch (err: any) {
    console.error("[USERS] List error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

