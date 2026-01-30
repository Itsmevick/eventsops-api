import type { Role, EventStatus } from "../types/prisma-enums";
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
export declare function createEvent(input: CreateEventInput): Promise<{
    _count: {
        assignments: number;
        checkIns: number;
    };
    organizer: {
        id: string;
        name: string;
        email: string;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    venue: string | null;
    startAt: Date;
    endAt: Date;
    capacity: number;
    status: import("@prisma/client").$Enums.EventStatus;
    organizerId: string;
}>;
export declare function listEvents(userId: string, userRole: Role, status?: EventStatus): Promise<({
    _count: {
        assignments: number;
        checkIns: number;
    };
    organizer: {
        id: string;
        name: string;
        email: string;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    venue: string | null;
    startAt: Date;
    endAt: Date;
    capacity: number;
    status: import("@prisma/client").$Enums.EventStatus;
    organizerId: string;
})[]>;
export declare function getEventById(eventId: string, userId: string, userRole: Role): Promise<{
    _count: {
        assignments: number;
        checkIns: number;
    };
    organizer: {
        id: string;
        name: string;
        email: string;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    venue: string | null;
    startAt: Date;
    endAt: Date;
    capacity: number;
    status: import("@prisma/client").$Enums.EventStatus;
    organizerId: string;
}>;
export declare function updateEvent(eventId: string, input: UpdateEventInput): Promise<{
    _count: {
        assignments: number;
        checkIns: number;
    };
    organizer: {
        id: string;
        name: string;
        email: string;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    venue: string | null;
    startAt: Date;
    endAt: Date;
    capacity: number;
    status: import("@prisma/client").$Enums.EventStatus;
    organizerId: string;
}>;
export declare function publishEvent(eventId: string): Promise<{
    _count: {
        assignments: number;
        checkIns: number;
    };
    organizer: {
        id: string;
        name: string;
        email: string;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    venue: string | null;
    startAt: Date;
    endAt: Date;
    capacity: number;
    status: import("@prisma/client").$Enums.EventStatus;
    organizerId: string;
}>;
export declare function archiveEvent(eventId: string): Promise<{
    _count: {
        assignments: number;
        checkIns: number;
    };
    organizer: {
        id: string;
        name: string;
        email: string;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    venue: string | null;
    startAt: Date;
    endAt: Date;
    capacity: number;
    status: import("@prisma/client").$Enums.EventStatus;
    organizerId: string;
}>;
export declare function getEventMetrics(eventId: string): Promise<{
    eventId: string;
    capacity: number;
    totalCheckIns: number;
    attendanceRate: number | null;
}>;
//# sourceMappingURL=events.service.d.ts.map