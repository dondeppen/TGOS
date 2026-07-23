import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "tgos_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

export type UserRole = "owner" | "marketing";

export type TgosUser = {
  username: string;
  displayName: string;
  role: UserRole;
};

export type SessionPayload = TgosUser & {
  exp: number;
  sub: string;
};

type ConfiguredUser = TgosUser & {
  password: string;
};

function getSessionSecret(): string | null {
  return process.env.TGOS_SESSION_SECRET || null;
}

function getConfiguredUsers(): ConfiguredUser[] {
  const ownerUsername = process.env.TGOS_OWNER_USERNAME || process.env.TGOS_USERNAME;
  const ownerPassword = process.env.TGOS_OWNER_PASSWORD || process.env.TGOS_PASSWORD;
  const marketingUsername = process.env.TGOS_MARKETING_USERNAME;
  const marketingPassword = process.env.TGOS_MARKETING_PASSWORD;

  return [
    ownerUsername && ownerPassword
      ? {
          username: ownerUsername,
          password: ownerPassword,
          displayName: "Don Deppen",
          role: "owner" as const,
        }
      : null,
    marketingUsername && marketingPassword
      ? {
          username: marketingUsername,
          password: marketingPassword,
          displayName: "Scott Widing",
          role: "marketing" as const,
        }
      : null,
  ].filter((user): user is ConfiguredUser => user !== null);
}

function encode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string): string | null {
  const secret = getSessionSecret();
  if (!secret) return null;

  return createHmac("sha256", secret).update(value).digest("base64url");
}

function signaturesMatch(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function authenticateUser(
  username: string,
  password: string,
): TgosUser | null {
  const normalizedUsername = username.trim().toLowerCase();
  const user = getConfiguredUsers().find(
    (candidate) => candidate.username.trim().toLowerCase() === normalizedUsername,
  );

  if (!user || user.password !== password) return null;

  return {
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  };
}

export function createSessionToken(user: TgosUser): string | null {
  const payload: SessionPayload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
    sub: user.username,
  };
  const encodedPayload = encode(JSON.stringify(payload));
  const signature = sign(encodedPayload);

  return signature ? `${encodedPayload}.${signature}` : null;
}

export function readSessionToken(
  token: string | undefined,
): SessionPayload | null {
  if (!token) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = sign(encodedPayload);
  if (!expectedSignature || !signaturesMatch(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(decode(encodedPayload)) as SessionPayload;
    const isValidRole = payload.role === "owner" || payload.role === "marketing";
    const isValidIdentity = Boolean(
      payload.sub && payload.username && payload.displayName,
    );

    return isValidRole && isValidIdentity && payload.exp > Math.floor(Date.now() / 1000)
      ? payload
      : null;
  } catch {
    return null;
  }
}

export function verifySessionToken(token: string | undefined): boolean {
  return readSessionToken(token) !== null;
}

export const sessionCookieOptions = {
  httpOnly: true,
  maxAge: SESSION_DURATION_SECONDS,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};
