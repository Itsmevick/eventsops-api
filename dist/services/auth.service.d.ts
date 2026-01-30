import type { Role } from "../types/prisma-enums";
export type PublicUser = {
    id: string;
    name: string;
    email: string;
    role: Role;
};
export declare function registerUser(input: {
    name: string;
    email: string;
    password: string;
}): Promise<PublicUser>;
export declare function loginUser(input: {
    email: string;
    password: string;
}): Promise<{
    user: PublicUser;
}>;
export declare function getMe(userId: string): Promise<PublicUser>;
//# sourceMappingURL=auth.service.d.ts.map