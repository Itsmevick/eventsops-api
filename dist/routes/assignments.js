import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { requireRole } from "../middleware/requireRole";
import { remove } from "../controllers/assignments.controller";
const router = Router();
// DELETE /api/assignments/:assignmentId - Delete assignment
router.delete("/:assignmentId", requireAuth, requireRole("ADMIN", "ORGANIZER"), remove);
export default router;
//# sourceMappingURL=assignments.js.map