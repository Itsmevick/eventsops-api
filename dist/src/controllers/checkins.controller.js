import { z } from "zod";
import { createCheckIn, listCheckInsByEvent } from "../services/checkins.service";
const createCheckInSchema = z.object({
    attendeeName: z.string().min(2),
    attendeeEmail: z.string().email().optional().nullable(),
});
export async function create(req, res) {
    try {
        if (!req.user || !req.event) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const body = createCheckInSchema.parse(req.body);
        const eventId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!eventId) {
            return res.status(400).json({ error: "Event ID is required" });
        }
        const checkIn = await createCheckIn({
            eventId,
            attendeeName: body.attendeeName,
            attendeeEmail: body.attendeeEmail ?? null,
            checkedInByUserId: req.user.id,
        });
        return res.status(201).json({ data: checkIn });
    }
    catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: "Validation failed", issues: err.issues });
        }
        console.error("[CHECKINS] Create error", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
export async function listByEvent(req, res) {
    try {
        if (!req.user || !req.event) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const eventId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!eventId) {
            return res.status(400).json({ error: "Event ID is required" });
        }
        const checkIns = await listCheckInsByEvent(eventId);
        return res.json({ data: checkIns });
    }
    catch (err) {
        console.error("[CHECKINS] List error", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
//# sourceMappingURL=checkins.controller.js.map