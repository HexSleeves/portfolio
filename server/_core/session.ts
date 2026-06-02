import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { parse as parseCookieHeader } from "cookie";
import type { Request, Response } from "express";
import { SignJWT, jwtVerify } from "jose";
import type { User } from "../../drizzle/schema";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";

type SessionPayload = {
  sub: string;
  email: string;
  role: "admin";
};

const encoder = new TextEncoder();

function getSecretKey() {
  return encoder.encode(ENV.cookieSecret);
}

function parseCookies(cookieHeader: string | undefined) {
  if (!cookieHeader) return new Map<string, string>();
  return new Map(Object.entries(parseCookieHeader(cookieHeader)));
}

function createAdminUser(email = ENV.adminEmail): User {
  const now = new Date();
  return {
    id: 1,
    openId: "admin",
    name: "Admin",
    email,
    loginMethod: "password",
    role: "admin",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
  };
}

async function createSessionToken(payload: SessionPayload): Promise<string> {
  const issuedAt = Date.now();
  const expirationSeconds = Math.floor((issuedAt + ONE_YEAR_MS) / 1000);

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(Math.floor(issuedAt / 1000))
    .setExpirationTime(expirationSeconds)
    .sign(getSecretKey());
}

async function verifySessionToken(
  cookieValue: string | undefined | null
): Promise<SessionPayload | null> {
  if (!cookieValue) return null;

  try {
    const { payload } = await jwtVerify(cookieValue, getSecretKey(), {
      algorithms: ["HS256"],
    });

    if (
      payload.sub !== "admin" ||
      payload.role !== "admin" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }

    return {
      sub: "admin",
      email: payload.email,
      role: "admin",
    };
  } catch {
    return null;
  }
}

export async function authenticateRequest(req: Request): Promise<User | null> {
  const cookies = parseCookies(req.headers.cookie);
  const session = await verifySessionToken(cookies.get(COOKIE_NAME));
  return session ? createAdminUser(session.email) : null;
}

export async function setSessionCookie(
  req: Request,
  res: Response,
  email: string
) {
  const token = await createSessionToken({
    sub: "admin",
    email,
    role: "admin",
  });
  res.cookie(COOKIE_NAME, token, {
    ...getSessionCookieOptions(req),
    maxAge: ONE_YEAR_MS,
  });
}

export function clearSessionCookie(req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, {
    ...getSessionCookieOptions(req),
    maxAge: -1,
  });
}
