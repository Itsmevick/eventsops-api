import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma.js";
import router from "./routes/index.js";
import { requestLogger } from "./middleware/requestLogger.js";
dotenv.config();
const app = express();
app.use(requestLogger);
app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "eventops-api" });
});
app.get("/db-health", async (_req, res) => {
    const users = await prisma.user.count();
    res.json({ ok: true, users });
});
app.use("/api", router);
export default app;
//# sourceMappingURL=app.js.map