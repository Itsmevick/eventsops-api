import { prisma } from "../lib/prisma.js";
export async function createEvent(input) {
    console.info("[EVENTS] Creating event", { title: input.title, organizerId: input.organizerId });
    const event = await prisma.event.create({
        data: {
            title: input.title,
            description: input.description ?? null,
            venue: input.venue ?? null,
            startAt: input.startAt,
            endAt: input.endAt,
            capacity: input.capacity ?? 0,
            organizerId: input.organizerId,
            status: "DRAFT",
        },
        include: {
            organizer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            _count: {
                select: {
                    assignments: true,
                    checkIns: true,
                },
            },
        },
    });
    console.info("[EVENTS] Event created", { id: event.id, title: event.title });
    return event;
}
export async function listEvents(userId, userRole, status) {
    console.info("[EVENTS] Listing events", { userId, userRole, status });
    let where = {};
    if (status) {
        where.status = status;
    }
    if (userRole === "ADMIN") {
        // ADMIN: all events
    }
    else if (userRole === "ORGANIZER") {
        // ORGANIZER: only their events
        where.organizerId = userId;
    }
    else if (userRole === "STAFF") {
        // STAFF: only events they're assigned to
        where.assignments = {
            some: {
                userId: userId,
            },
        };
    }
    const events = await prisma.event.findMany({
        where,
        orderBy: {
            updatedAt: "desc",
        },
        include: {
            organizer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            _count: {
                select: {
                    assignments: true,
                    checkIns: true,
                },
            },
        },
    });
    console.info("[EVENTS] Found events", { count: events.length, userId, userRole });
    return events;
}
export async function getEventById(eventId, userId, userRole) {
    console.info("[EVENTS] Getting event", { eventId, userId, userRole });
    let where = { id: eventId };
    // STAFF can only see events they're assigned to
    if (userRole === "STAFF") {
        where.assignments = {
            some: {
                userId: userId,
            },
        };
    }
    const event = await prisma.event.findFirst({
        where,
        include: {
            organizer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            _count: {
                select: {
                    assignments: true,
                    checkIns: true,
                },
            },
        },
    });
    if (!event) {
        const e = new Error("NOT_FOUND");
        e.statusCode = 404;
        throw e;
    }
    return event;
}
export async function updateEvent(eventId, input) {
    console.info("[EVENTS] Updating event", { eventId, updates: Object.keys(input) });
    const updateData = {};
    if (input.title !== undefined)
        updateData.title = input.title;
    if (input.description !== undefined)
        updateData.description = input.description ?? null;
    if (input.venue !== undefined)
        updateData.venue = input.venue ?? null;
    if (input.startAt !== undefined)
        updateData.startAt = input.startAt;
    if (input.endAt !== undefined)
        updateData.endAt = input.endAt;
    if (input.capacity !== undefined)
        updateData.capacity = input.capacity;
    const event = await prisma.event.update({
        where: { id: eventId },
        data: updateData,
        include: {
            organizer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            _count: {
                select: {
                    assignments: true,
                    checkIns: true,
                },
            },
        },
    });
    console.info("[EVENTS] Event updated", { id: event.id });
    return event;
}
export async function publishEvent(eventId) {
    console.info("[EVENTS] Publishing event", { eventId });
    const event = await prisma.event.update({
        where: { id: eventId },
        data: {
            status: "PUBLISHED",
        },
        include: {
            organizer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            _count: {
                select: {
                    assignments: true,
                    checkIns: true,
                },
            },
        },
    });
    console.info("[EVENTS] Event published", { id: event.id });
    return event;
}
export async function archiveEvent(eventId) {
    console.info("[EVENTS] Archiving event", { eventId });
    const event = await prisma.event.update({
        where: { id: eventId },
        data: {
            status: "ARCHIVED",
        },
        include: {
            organizer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            _count: {
                select: {
                    assignments: true,
                    checkIns: true,
                },
            },
        },
    });
    console.info("[EVENTS] Event archived", { id: event.id });
    return event;
}
export async function getEventMetrics(eventId) {
    console.info("[EVENTS] Getting metrics", { eventId });
    // Get event with capacity
    const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: {
            id: true,
            capacity: true,
        },
    });
    if (!event) {
        const e = new Error("NOT_FOUND");
        e.statusCode = 404;
        throw e;
    }
    // Count check-ins using aggregate
    const checkInsCount = await prisma.checkIn.count({
        where: { eventId },
    });
    const attendanceRate = event.capacity > 0 ? (checkInsCount / event.capacity) * 100 : null;
    console.info("[EVENTS] Metrics calculated", {
        eventId,
        capacity: event.capacity,
        totalCheckIns: checkInsCount,
        attendanceRate,
    });
    return {
        eventId: event.id,
        capacity: event.capacity,
        totalCheckIns: checkInsCount,
        attendanceRate: attendanceRate !== null ? Math.round(attendanceRate * 100) / 100 : null, // Round to 2 decimal places
    };
}
//# sourceMappingURL=events.service.js.map