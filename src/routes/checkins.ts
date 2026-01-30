import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { requireRole } from "../middleware/requireRole";
import { requireEventAccess } from "../middleware/requireEventAccess";
import { requireEventStaffOrOwner } from "../middleware/requireEventStaffOrOwner";
import { create, listByEvent } from "../controllers/checkins.controller";

const router = Router();

// Note: Event-specific check-in routes are mounted in events.ts
// This file is kept for potential future check-in routes

export default router;

