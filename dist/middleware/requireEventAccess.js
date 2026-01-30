import { prisma } from "../lib/prisma";
export async function requireEventAccess(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const eventId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!eventId) {
        return res.status(400).json({ error: "Event ID is required" });
    }
    try {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: {
                id: true,
                organizerId: true,
                title: true,
                status: true,
            },
        });
        if (!event) {
            console.warn("[EVENT] Not found", { eventId });
            return res.status(404).json({ error: "Event not found" });
        }
        const userRole = req.user.role;
        // ADMIN: allow all
        if (userRole === "ADMIN") {
            req.event = event;
            return next();
        }
        // ORGANIZER: allow only if they own the event
        if (userRole === "ORGANIZER") {
            if (event.organizerId === req.user.id) {
                req.event = event;
                return next();
            }
            console.warn("[EVENT] Forbidden - not organizer", {
                userId: req.user.id,
                organizerId: event.organizerId,
                eventId,
            });
            return res.status(403).json({ error: "Forbidden" });
        }
        // STAFF: deny
        console.warn("[EVENT] Forbidden - STAFF role", {
            userId: req.user.id,
            role: userRole,
            eventId,
        });
        return res.status(403).json({ error: "Forbidden" });
    }
    catch (err) {
        console.error("[EVENT] Error loading event", { error: err.message, eventId });
        return res.status(500).json({ error: "Internal server error" });
    }
}
//# sourceMappingURL=requireEventAccess.js.map