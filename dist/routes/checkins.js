import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import { requireEventAccess } from "../middleware/requireEventAccess.js";
import { requireEventStaffOrOwner } from "../middleware/requireEventStaffOrOwner.js";
import { create, listByEvent } from "../controllers/checkins.controller.js";
const router = Router();
// Note: Event-specific check-in routes are mounted in events.ts
// This file is kept for potential future check-in routes
export default router;
//# sourceMappingURL=checkins.js.map