import { Router } from "express";
import authRouter from "./auth.js";
import eventsRouter from "./events.js";
import assignmentsRouter from "./assignments.js";
import checkinsRouter from "./checkins.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/events", eventsRouter);
router.use("/assignments", assignmentsRouter);
router.use("/checkins", checkinsRouter);

export default router;

