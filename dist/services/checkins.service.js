import { prisma } from "../lib/prisma";
export async function createCheckIn(input) {
    console.info("[CHECKINS] Creating check-in", {
        eventId: input.eventId,
        attendeeName: input.attendeeName,
        checkedInByUserId: input.checkedInByUserId,
    });
    const checkIn = await prisma.checkIn.create({
        data: {
            eventId: input.eventId,
            attendeeName: input.attendeeName,
            attendeeEmail: input.attendeeEmail ?? null,
            checkedInByUserId: input.checkedInByUserId,
        },
        include: {
            checkedInByUser: {
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
    console.info("[CHECKINS] Check-in created", { id: checkIn.id });
    return checkIn;
}
export async function listCheckInsByEvent(eventId) {
    console.info("[CHECKINS] Listing check-ins", { eventId });
    const checkIns = await prisma.checkIn.findMany({
        where: { eventId },
        include: {
            checkedInByUser: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            checkedInAt: "desc",
        },
    });
    console.info("[CHECKINS] Found check-ins", { count: checkIns.length, eventId });
    return checkIns;
}
//# sourceMappingURL=checkins.service.js.map