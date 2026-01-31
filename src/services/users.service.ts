import { prisma } from "../lib/prisma.js";
import type { Role } from "../types/prisma-enums.js";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: Date | undefined;
}

function toPublicUser(user: {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: Date | undefined;
}): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    ...(user.createdAt !== undefined && { createdAt: user.createdAt }),
  };
}

/**
 * List all users
 * ADMIN: can see all users
 * ORGANIZER: can see all users
 * STAFF: cannot access (should return 403)
 */
export async function listUsers(userRole: Role): Promise<PublicUser[]> {
  console.info("[USERS] Listing users", { userRole });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.info("[USERS] Found users", { count: users.length });
  return users.map(toPublicUser);
}

