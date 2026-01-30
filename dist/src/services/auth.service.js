import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
function toPublicUser(user) {
    return { id: user.id, name: user.name, email: user.email, role: user.role };
}
export async function registerUser(input) {
    console.info("[AUTH] register attempt", { email: input.email });
    const passwordHash = await bcrypt.hash(input.password, 12);
    try {
        const user = await prisma.user.create({
            data: {
                name: input.name,
                email: input.email.toLowerCase(),
                passwordHash,
                // role default is ORGANIZER in schema
            },
            select: { id: true, name: true, email: true, role: true },
        });
        console.info("[AUTH] user created", { id: user.id, email: user.email });
        return toPublicUser(user);
    }
    catch (err) {
        // Prisma unique constraint error
        if (err?.code === "P2002") {
            const e = new Error("EMAIL_EXISTS");
            e.statusCode = 409;
            throw e;
        }
        throw err;
    }
}
export async function loginUser(input) {
    console.info("[AUTH] login attempt", { email: input.email });
    const user = await prisma.user.findUnique({
        where: { email: input.email.toLowerCase() },
        select: { id: true, name: true, email: true, role: true, passwordHash: true },
    });
    if (!user) {
        const e = new Error("INVALID_CREDENTIALS");
        e.statusCode = 401;
        throw e;
    }
    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) {
        const e = new Error("INVALID_CREDENTIALS");
        e.statusCode = 401;
        throw e;
    }
    console.info("[AUTH] login ok", { id: user.id, email: user.email });
    return { user: toPublicUser(user) };
}
export async function getMe(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true },
    });
    if (!user) {
        const e = new Error("NOT_FOUND");
        e.statusCode = 404;
        throw e;
    }
    return toPublicUser(user);
}
//# sourceMappingURL=auth.service.js.map