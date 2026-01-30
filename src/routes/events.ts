import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import { requireEventAccess } from "../middleware/requireEventAccess.js";
import {
  create,
  list,
  getById,
  update,
  publish,
  archive,
  metrics,
} from "../controllers/events.controller.js";
import { create as createAssignment, listByEvent } from "../controllers/assignments.controller.js";
import { create as createCheckIn, listByEvent as listCheckInsByEvent } from "../controllers/checkins.controller.js";
import { requireEventStaffOrOwner } from "../middleware/requireEventStaffOrOwner.js";

const router = Router();

// POST /api/events - Create event (ADMIN or ORGANIZER only)
router.post("/", requireAuth, requireRole("ADMIN", "ORGANIZER"), create);

// GET /api/events - List events (role-based filtering)
router.get("/", requireAuth, list);

// POST /api/events/:id/assignments - Create assignment (ADMIN/ORGANIZER + event owner)
router.post("/:id/assignments", requireAuth, requireRole("ADMIN", "ORGANIZER"), requireEventAccess, createAssignment);

// GET /api/events/:id/assignments - List assignments (role-based access)
router.get("/:id/assignments", requireAuth, listByEvent);

// POST /api/events/:id/checkins - Create check-in (ADMIN/ORGANIZER/STAFF with assignment)
router.post("/:id/checkins", requireAuth, requireEventStaffOrOwner, createCheckIn);

// GET /api/events/:id/checkins - List check-ins (ADMIN/ORGANIZER only)
router.get("/:id/checkins", requireAuth, requireRole("ADMIN", "ORGANIZER"), requireEventAccess, listCheckInsByEvent);

// GET /api/events/:id/metrics - Get event metrics (ADMIN/ORGANIZER only)
router.get("/:id/metrics", requireAuth, requireRole("ADMIN", "ORGANIZER"), requireEventAccess, metrics);

// GET /api/events/:id - Get single event
// For ADMIN/ORGANIZER: requireEventAccess middleware
// For STAFF: handled in controller (can read assigned events)
router.get("/:id", requireAuth, async (req, res, next) => {
  // Only apply requireEventAccess for ADMIN/ORGANIZER
  // STAFF access is handled in getById controller
  if (req.user?.role === "ADMIN" || req.user?.role === "ORGANIZER") {
    return requireEventAccess(req, res, next);
  }
  next();
}, getById);

// PATCH /api/events/:id - Update event (ADMIN/ORGANIZER only via requireEventAccess)
router.patch("/:id", requireAuth, requireEventAccess, update);

// PATCH /api/events/:id/publish - Publish event
router.patch("/:id/publish", requireAuth, requireEventAccess, publish);

// PATCH /api/events/:id/archive - Archive event
router.patch("/:id/archive", requireAuth, requireEventAccess, archive);

export default router;

