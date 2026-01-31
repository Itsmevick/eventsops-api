import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { list } from "../controllers/users.controller.js";
const router = Router();
// GET /api/users - List all users (ADMIN/ORGANIZER only)
router.get("/", requireAuth, list);
export default router;
//# sourceMappingURL=users.js.map