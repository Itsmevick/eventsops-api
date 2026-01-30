import { Router } from "express";
import authRouter from "./auth";
import eventsRouter from "./events";
import assignmentsRouter from "./assignments";
import checkinsRouter from "./checkins";
const router = Router();
router.use("/auth", authRouter);
router.use("/events", eventsRouter);
router.use("/assignments", assignmentsRouter);
router.use("/checkins", checkinsRouter);
export default router;
//# sourceMappingURL=index.js.map