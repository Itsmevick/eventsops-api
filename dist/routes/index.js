import { Router } from "express";
import authRouter from "./auth.js";
import eventsRouter from "./events.js";
import assignmentsRouter from "./assignments.js";
import checkinsRouter from "./checkins.js";
import usersRouter from "./users.js";
const router = Router();
router.use("/auth", authRouter);
router.use("/events", eventsRouter);
router.use("/assignments", assignmentsRouter);
router.use("/checkins", checkinsRouter);
router.use("/users", usersRouter);
export default router;
//# sourceMappingURL=index.js.map