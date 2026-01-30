import type { NextFunction, Request, Response } from "express";
import type { Role } from "../types/prisma-enums";
export declare function requireRole(...allowedRoles: Role[]): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=requireRole.d.ts.map