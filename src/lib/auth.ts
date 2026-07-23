import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "tgos_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  exp: number;
  sub: "owner";
};

function getSessionSecret(): string | null {
  return process.env.TGOS_SESSION_SECRET || null;
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

export function createSessionToken(): string | null {
  const payload: SessionPayload = {
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
    sub: "owner",
  };
  const encodedPayload = encode(JSON.stringify(payload));
  const signature = sign(encodedPayload);

  return signature ? `${encodedPayload}.${signature}` : null;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  const expectedSignature = sign(encodedPayload);
  if (!expectedSignature || !signaturesMatch(signature, expectedSignature)) {
    return false;
  }

  try {
    const payload = JSON.parse(decode(encodedPayload)) as SessionPayload;
    return payload.sub === "owner" && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function hasValidCredentials(username: string, password: string): boolean {
  const configuredUsername = process.env.TGOS_USERNAME;
  const configuredPassword = process.env.TGOS_PASSWORD;

  return Boolean(
    configuredUsername &&
      configuredPassword &&
      username === configuredUsername &&
      password === configuredPassword,
  );
}

export const sessionCookieOptions = {
  httpOnly: true,
  maxAge: SESSION_DURATION_SECONDS,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};
