import type { Request, Response } from "express";
import { z } from "zod";
import {
  createAssignment,
  listAssignmentsByEvent,
  deleteAssignment,
} from "../services/assignments.service";

const createAssignmentSchema = z.object({
  userId: z.string().min(1),
  roleName: z.string().min(2),
});

export async function create(req: Request, res: Response) {
  try {
    if (!req.user || !req.event) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const body = createAssignmentSchema.parse(req.body);
    const eventId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!eventId) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    const assignment = await createAssignment({
      eventId,
      userId: body.userId,
      roleName: body.roleName,
    });

    return res.status(201).json({ data: assignment });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", issues: err.issues });
    }
    if (err?.statusCode === 404) {
      if (err.message === "USER_NOT_FOUND") {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(404).json({ error: "Event not found" });
    }
    if (err?.statusCode === 409) {
      return res.status(409).json({ error: "Assignment already exists" });
    }
    console.error("[ASSIGNMENTS] Create error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function listByEvent(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const eventId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!eventId) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    const assignments = await listAssignmentsByEvent(
      eventId,
      req.user.id,
      req.user.role
    );

    return res.json({ data: assignments });
  } catch (err: any) {
    if (err?.statusCode === 404) {
      return res.status(404).json({ error: "Event not found" });
    }
    if (err?.statusCode === 403) {
      return res.status(403).json({ error: "Forbidden" });
    }
    console.error("[ASSIGNMENTS] List error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const assignmentId = Array.isArray(req.params.assignmentId)
      ? req.params.assignmentId[0]
      : req.params.assignmentId;

    if (!assignmentId) {
      return res.status(400).json({ error: "Assignment ID is required" });
    }

    await deleteAssignment(assignmentId, req.user.id, req.user.role);

    return res.json({ ok: true });
  } catch (err: any) {
    if (err?.statusCode === 404) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    if (err?.statusCode === 403) {
      return res.status(403).json({ error: "Forbidden" });
    }
    console.error("[ASSIGNMENTS] Delete error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

