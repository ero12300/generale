import { cookies } from "next/headers";

const SESSION_COOKIE = "barber_session";

export interface Session {
  email: string;
  name: string;
}

/**
 * Sessione minimale basata su cookie per la modalità demo.
 * In produzione con Firebase Auth si sostituisce con la verifica dell'ID token
 * Firebase (firebase-admin), mantenendo la stessa forma `Session`.
 */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (parsed?.email) return parsed as Session;
  } catch {
    return null;
  }
  return null;
}

export async function createSession(session: Session): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, encodeURIComponent(JSON.stringify(session)), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
