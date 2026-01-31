import { prisma } from "../lib/prisma.js";
import type { Role, EventStatus } from "../types/prisma-enums.js";

export type CreateEventInput = {
  title: string;
  description?: string | null;
  venue?: string | null;
  startAt: Date;
  endAt: Date;
  capacity?: number;
  organizerId: string;
};

export type UpdateEventInput = {
  title?: string;
  description?: string | null;
  venue?: string | null;
  startAt?: Date;
  endAt?: Date;
  capacity?: number;
};

export async function createEvent(input: CreateEventInput) {
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

export async function listEvents(userId: string, userRole: Role, status?: EventStatus) {
  console.info("[EVENTS] Listing events", { userId, userRole, status });

  let where: any = {};

  if (status) {
    where.status = status;
  }

  if (userRole === "ADMIN") {
    // ADMIN: all events
  } else if (userRole === "ORGANIZER") {
    // ORGANIZER: only their events
    where.organizerId = userId;
  } else if (userRole === "STAFF") {
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

export async function getEventById(eventId: string, userId: string, userRole: Role) {
  console.info("[EVENTS] Getting event", { eventId, userId, userRole });

  let where: any = { id: eventId };

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
    (e as any).statusCode = 404;
    throw e;
  }

  return event;
}

export async function updateEvent(eventId: string, input: UpdateEventInput) {
  console.info("[EVENTS] Updating event", { eventId, updates: Object.keys(input) });

  const updateData: any = {};
  if (input.title !== undefined) updateData.title = input.title;
  if (input.description !== undefined) updateData.description = input.description ?? null;
  if (input.venue !== undefined) updateData.venue = input.venue ?? null;
  if (input.startAt !== undefined) updateData.startAt = input.startAt;
  if (input.endAt !== undefined) updateData.endAt = input.endAt;
  if (input.capacity !== undefined) updateData.capacity = input.capacity;

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

export async function publishEvent(eventId: string) {
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

export async function archiveEvent(eventId: string) {
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

export async function getEventStats(userId: string, userRole: Role) {
  console.info("[EVENTS] Getting stats", { userId, userRole });

  let where: any = {};

  // Role-based filtering
  if (userRole === "ADMIN") {
    // ADMIN: all events
  } else if (userRole === "ORGANIZER") {
    // ORGANIZER: only their events
    where.organizerId = userId;
  } else if (userRole === "STAFF") {
    // STAFF: only events they're assigned to
    where.assignments = {
      some: {
        userId: userId,
      },
    };
  }

  // Get total count
  const total = await prisma.event.count({ where });

  // Get published count
  const published = await prisma.event.count({
    where: {
      ...where,
      status: "PUBLISHED",
    },
  });

  // Get upcoming count (events with startAt in the future)
  const now = new Date();
  const upcoming = await prisma.event.count({
    where: {
      ...where,
      startAt: {
        gt: now,
      },
    },
  });

  console.info("[EVENTS] Stats calculated", {
    userId,
    userRole,
    total,
    published,
    upcoming,
  });

  return {
    total,
    published,
    upcoming,
  };
}

export async function getEventMetrics(eventId: string) {
  console.info("[EVENTS] Getting metrics", { eventId });

  // Verify event exists
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
    },
  });

  if (!event) {
    const e = new Error("NOT_FOUND");
    (e as any).statusCode = 404;
    throw e;
  }

  // Count total assignments
  const totalAssignments = await prisma.assignment.count({
    where: { eventId },
  });

  // Count total check-ins
  const totalCheckIns = await prisma.checkIn.count({
    where: { eventId },
  });

  // Get assignments grouped by role
  const assignments = await prisma.assignment.findMany({
    where: { eventId },
    select: {
      roleName: true,
    },
  });

  const assignmentsByRole: Record<string, number> = {};
  assignments.forEach((assignment) => {
    assignmentsByRole[assignment.roleName] =
      (assignmentsByRole[assignment.roleName] || 0) + 1;
  });

  // Count check-ins today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const checkInsToday = await prisma.checkIn.count({
    where: {
      eventId,
      checkedInAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  console.info("[EVENTS] Metrics calculated", {
    eventId,
    totalAssignments,
    totalCheckIns,
    checkInsToday,
    rolesCount: Object.keys(assignmentsByRole).length,
  });

  return {
    totalAssignments,
    totalCheckIns,
    assignmentsByRole,
    checkInsToday,
  };
}

