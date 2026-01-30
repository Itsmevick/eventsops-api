import type { Role, EventStatus } from "./prisma-enums.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
      };
      event?: {
        id: string;
        organizerId: string;
        title: string;
        status: EventStatus;
      };
    }
  }
}

export {};


