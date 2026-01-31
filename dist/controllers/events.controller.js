import { z } from "zod";
import { createEvent, listEvents, getEventById, updateEvent, publishEvent, archiveEvent, getEventStats, getEventMetrics, } from "../services/events.service.js";
const createEventSchema = z
    .object({
    title: z.string().min(3),
    description: z.string().optional().nullable(),
    venue: z.string().optional().nullable(),
    startAt: z.string().datetime(),
    endAt: z.string().datetime(),
    capacity: z.number().int().min(0).optional(),
})
    .refine((data) => new Date(data.endAt) > new Date(data.startAt), {
    message: "endAt must be after startAt",
    path: ["endAt"],
});
const updateEventSchema = z
    .object({
    title: z.string().min(3).optional(),
    description: z.string().optional().nullable(),
    venue: z.string().optional().nullable(),
    startAt: z.string().datetime().optional(),
    endAt: z.string().datetime().optional(),
    capacity: z.number().int().min(0).optional(),
})
    .refine((data) => {
    if (data.startAt && data.endAt) {
        return new Date(data.endAt) > new Date(data.startAt);
    }
    return true;
}, {
    message: "endAt must be after startAt",
    path: ["endAt"],
});
export async function create(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const body = createEventSchema.parse(req.body);
        const event = await createEvent({
            title: body.title,
            description: body.description ?? null,
            venue: body.venue ?? null,
            startAt: new Date(body.startAt),
            endAt: new Date(body.endAt),
            ...(body.capacity !== undefined && { capacity: body.capacity }),
            organizerId: req.user.id,
        });
        return res.status(201).json({ data: event });
    }
    catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: "Validation failed", issues: err.issues });
        }
        console.error("[EVENTS] Create error", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
export async function list(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const status = req.query.status;
        const events = await listEvents(req.user.id, req.user.role, status);
        return res.json({ data: events });
    }
    catch (err) {
        console.error("[EVENTS] List error", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
export async function stats(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const stats = await getEventStats(req.user.id, req.user.role);
        return res.json({ data: stats });
    }
    catch (err) {
        console.error("[EVENTS] Stats error", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
export async function getById(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const eventId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!eventId) {
            return res.status(400).json({ error: "Event ID is required" });
        }
        const event = await getEventById(eventId, req.user.id, req.user.role);
        return res.json({ data: event });
    }
    catch (err) {
        if (err?.statusCode === 404) {
            return res.status(404).json({ error: "Event not found" });
        }
        console.error("[EVENTS] GetById error", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
export async function update(req, res) {
    try {
        if (!req.event) {
            return res.status(404).json({ error: "Event not found" });
        }
        const body = updateEventSchema.parse(req.body);
        const updates = {};
        if (body.title !== undefined)
            updates.title = body.title;
        if (body.description !== undefined)
            updates.description = body.description;
        if (body.venue !== undefined)
            updates.venue = body.venue;
        if (body.startAt !== undefined)
            updates.startAt = new Date(body.startAt);
        if (body.endAt !== undefined)
            updates.endAt = new Date(body.endAt);
        if (body.capacity !== undefined)
            updates.capacity = body.capacity;
        const event = await updateEvent(req.event.id, updates);
        return res.json({ data: event });
    }
    catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: "Validation failed", issues: err.issues });
        }
        console.error("[EVENTS] Update error", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
export async function publish(req, res) {
    try {
        if (!req.event) {
            return res.status(404).json({ error: "Event not found" });
        }
        const event = await publishEvent(req.event.id);
        return res.json({ data: event });
    }
    catch (err) {
        console.error("[EVENTS] Publish error", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
export async function archive(req, res) {
    try {
        if (!req.event) {
            return res.status(404).json({ error: "Event not found" });
        }
        const event = await archiveEvent(req.event.id);
        return res.json({ data: event });
    }
    catch (err) {
        console.error("[EVENTS] Archive error", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
export async function metrics(req, res) {
    try {
        if (!req.event) {
            return res.status(404).json({ error: "Event not found" });
        }
        const metrics = await getEventMetrics(req.event.id);
        return res.json({ data: metrics });
    }
    catch (err) {
        if (err?.statusCode === 404) {
            return res.status(404).json({ error: "Event not found" });
        }
        console.error("[EVENTS] Metrics error", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
//# sourceMappingURL=events.controller.js.map