import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import { remove } from "../controllers/assignments.controller.js";
const router = Router();
// DELETE /api/assignments/:assignmentId - Delete assignment
router.delete("/:assignmentId", requireAuth, requireRole("ADMIN", "ORGANIZER"), remove);
export default router;
//# sourceMappingURL=assignments.js.map