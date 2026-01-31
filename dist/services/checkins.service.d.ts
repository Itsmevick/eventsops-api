export type CreateCheckInInput = {
    eventId: string;
    attendeeName: string;
    attendeeEmail?: string | null;
    checkedInByUserId: string;
};
export declare function createCheckIn(input: CreateCheckInInput): Promise<{
    event: {
        id: string;
        title: string;
    };
    checkedInBy: {
        id: string;
        name: string;
        email: string;
    };
} & {
    id: string;
    eventId: string;
    attendeeName: string;
    attendeeEmail: string | null;
    checkedInAt: Date;
    checkedInByUserId: string;
}>;
export declare function listCheckInsByEvent(eventId: string): Promise<({
    checkedInBy: {
        id: string;
        name: string;
        email: string;
    };
} & {
    id: string;
    eventId: string;
    attendeeName: string;
    attendeeEmail: string | null;
    checkedInAt: Date;
    checkedInByUserId: string;
})[]>;
//# sourceMappingURL=checkins.service.d.ts.map