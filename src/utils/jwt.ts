import jwt from "jsonwebtoken";
import type { Role } from "../types/prisma-enums";

type AccessTokenPayload = {
  sub: string;
  role: Role;
};

function getAccessSecret(): string {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("JWT_ACCESS_SECRET is required");
  return secret;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, getAccessSecret(), {
    algorithm: "HS256",
    expiresIn: "15m",
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, getAccessSecret(), {
    algorithms: ["HS256"],
  });

  if (typeof decoded !== "object" || decoded === null) {
    throw new Error("Invalid token payload");
  }

  const { sub, role } = decoded as Partial<AccessTokenPayload>;
  if (!sub || !role) throw new Error("Invalid token payload");

  return { sub, role };
}


