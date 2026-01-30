import type { Role } from "../types/prisma-enums";
export type CreateAssignmentInput = {
    eventId: string;
    userId: string;
    roleName: string;
};
export declare function createAssignment(input: CreateAssignmentInput): Promise<{
    user: {
        id: string;
        name: string;
        email: string;
    };
    event: {
        id: string;
        title: string;
    };
} & {
    id: string;
    createdAt: Date;
    eventId: string;
    roleName: string;
    userId: string;
}>;
export declare function listAssignmentsByEvent(eventId: string, userId: string, userRole: Role): Promise<({
    user: {
        id: string;
        name: string;
        email: string;
    };
} & {
    id: string;
    createdAt: Date;
    eventId: string;
    roleName: string;
    userId: string;
})[]>;
export declare function deleteAssignment(assignmentId: string, userId: string, userRole: Role): Promise<void>;
//# sourceMappingURL=assignments.service.d.ts.map