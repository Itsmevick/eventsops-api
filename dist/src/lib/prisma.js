import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is required");
}
const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "production"
        ? ["error"]
        : ["query", "info", "warn", "error"],
});
if (process.env.NODE_ENV !== "production") {
    prisma.$on("query", (e) => {
        console.info("[DB] query", {
            model: e.model,
            action: e.action,
            duration: e.duration,
        });
    });
    prisma.$on("error", (e) => {
        console.error("[DB] error", e);
    });
    prisma.$on("warn", (e) => {
        console.warn("[DB] warn", e);
    });
}
//# sourceMappingURL=prisma.js.map