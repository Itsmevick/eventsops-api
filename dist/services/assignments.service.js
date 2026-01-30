import { prisma } from "../lib/prisma";
export async function createAssignment(input) {
    console.info("[ASSIGNMENTS] Creating assignment", {
        eventId: input.eventId,
        userId: input.userId,
        roleName: input.roleName,
    });
    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { id: input.userId },
        select: { id: true },
    });
    if (!user) {
        const e = new Error("USER_NOT_FOUND");
        e.statusCode = 404;
        throw e;
    }
    try {
        const assignment = await prisma.assignment.create({
            data: {
                eventId: input.eventId,
                userId: input.userId,
                roleName: input.roleName,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                event: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        console.info("[ASSIGNMENTS] Assignment created", { id: assignment.id });
        return assignment;
    }
    catch (err) {
        // Prisma unique constraint error
        if (err?.code === "P2002") {
            const e = new Error("DUPLICATE_ASSIGNMENT");
            e.statusCode = 409;
            throw e;
        }
        throw err;
    }
}
export async function listAssignmentsByEvent(eventId, userId, userRole) {
    console.info("[ASSIGNMENTS] Listing assignments", { eventId, userId, userRole });
    // Check event exists and access
    const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: {
            id: true,
            organizerId: true,
        },
    });
    if (!event) {
        const e = new Error("EVENT_NOT_FOUND");
        e.statusCode = 404;
        throw e;
    }
    // Check access
    if (userRole === "ADMIN") {
        // ADMIN: allow
    }
    else if (userRole === "ORGANIZER") {
        // ORGANIZER: only if they own the event
        if (event.organizerId !== userId) {
            const e = new Error("FORBIDDEN");
            e.statusCode = 403;
            throw e;
        }
    }
    else if (userRole === "STAFF") {
        // STAFF: only if they have an assignment for that event
        const hasAssignment = await prisma.assignment.findFirst({
            where: {
                eventId: eventId,
                userId: userId,
            },
        });
        if (!hasAssignment) {
            const e = new Error("FORBIDDEN");
            e.statusCode = 403;
            throw e;
        }
    }
    const assignments = await prisma.assignment.findMany({
        where: { eventId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    console.info("[ASSIGNMENTS] Found assignments", { count: assignments.length, eventId });
    return assignments;
}
export async function deleteAssignment(assignmentId, userId, userRole) {
    console.info("[ASSIGNMENTS] Deleting assignment", { assignmentId, userId, userRole });
    const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
        include: {
            event: {
                select: {
                    id: true,
                    organizerId: true,
                },
            },
        },
    });
    if (!assignment) {
        const e = new Error("ASSIGNMENT_NOT_FOUND");
        e.statusCode = 404;
        throw e;
    }
    // Check access
    if (userRole === "ADMIN") {
        // ADMIN: can delete any
    }
    else if (userRole === "ORGANIZER") {
        // ORGANIZER: only if they own the event
        if (assignment.event.organizerId !== userId) {
            const e = new Error("FORBIDDEN");
            e.statusCode = 403;
            throw e;
        }
    }
    else {
        // STAFF: cannot delete
        const e = new Error("FORBIDDEN");
        e.statusCode = 403;
        throw e;
    }
    await prisma.assignment.delete({
        where: { id: assignmentId },
    });
    console.info("[ASSIGNMENTS] Assignment deleted", { id: assignmentId });
}
//# sourceMappingURL=assignments.service.js.map