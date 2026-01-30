import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import type { Role } from "../types/prisma-enums";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

function toPublicUser(user: {
  id: string;
  name: string;
  email: string;
  role: Role;
}): PublicUser {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<PublicUser> {
  console.info("[AUTH] register attempt", { email: input.email });
  const passwordHash = await bcrypt.hash(input.password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        passwordHash,
        // role default is ORGANIZER in schema
      },
      select: { id: true, name: true, email: true, role: true },
    });

    console.info("[AUTH] user created", { id: user.id, email: user.email });
    return toPublicUser(user);
  } catch (err: any) {
    // Prisma unique constraint error
    if (err?.code === "P2002") {
      const e = new Error("EMAIL_EXISTS");
      (e as any).statusCode = 409;
      throw e;
    }
    throw err;
  }
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{ user: PublicUser }> {
  console.info("[AUTH] login attempt", { email: input.email });
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
    select: { id: true, name: true, email: true, role: true, passwordHash: true },
  });

  if (!user) {
    const e = new Error("INVALID_CREDENTIALS");
    (e as any).statusCode = 401;
    throw e;
  }

  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) {
    const e = new Error("INVALID_CREDENTIALS");
    (e as any).statusCode = 401;
    throw e;
  }

  console.info("[AUTH] login ok", { id: user.id, email: user.email });
  return { user: toPublicUser(user) };
}

export async function getMe(userId: string): Promise<PublicUser> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    const e = new Error("NOT_FOUND");
    (e as any).statusCode = 404;
    throw e;
  }

  return toPublicUser(user);
}


