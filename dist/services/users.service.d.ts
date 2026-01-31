import type { Role } from "../types/prisma-enums.js";
export interface PublicUser {
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt?: Date | undefined;
}
/**
 * List all users
 * ADMIN: can see all users
 * ORGANIZER: can see all users
 * STAFF: cannot access (should return 403)
 */
export declare function listUsers(userRole: Role): Promise<PublicUser[]>;
//# sourceMappingURL=users.service.d.ts.map