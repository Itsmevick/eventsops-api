import type { Role } from "../types/prisma-enums";
type AccessTokenPayload = {
    sub: string;
    role: Role;
};
export declare function signAccessToken(payload: AccessTokenPayload): string;
export declare function verifyAccessToken(token: string): AccessTokenPayload;
export {};
//# sourceMappingURL=jwt.d.ts.map