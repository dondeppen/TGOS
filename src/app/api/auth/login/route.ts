import { NextResponse } from "next/server";

import {
  createSessionToken,
  hasValidCredentials,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";

export async function POST(request: Request) {
  let body: { username?: unknown; password?: unknown };

  try {
    body = (await request.json()) as { username?: unknown; password?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (
    typeof body.username !== "string" ||
    typeof body.password !== "string" ||
    !hasValidCredentials(body.username, body.password)
  ) {
    return NextResponse.json(
      { error: "Invalid owner credentials." },
      { status: 401 },
    );
  }

  const token = createSessionToken();
  if (!token) {
    return NextResponse.json(
      { error: "Authentication is not configured." },
      { status: 503 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return response;
}
