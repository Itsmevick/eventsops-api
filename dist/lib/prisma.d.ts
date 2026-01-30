import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
export declare const prisma: PrismaClient<{
    adapter: PrismaPg;
    log: ("query" | "info" | "warn" | "error")[];
}, "query" | "info" | "warn" | "error", import("@prisma/client/runtime/client").DefaultArgs>;
//# sourceMappingURL=prisma.d.ts.map