"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import type { PlanId, UserProfile } from "@/types";
import { isFirebaseConfigured } from "@/lib/env";
import { getFirebase } from "@/lib/firebase/client";

type Status = "loading" | "authed" | "guest";

interface AuthCtx {
  status: Status;
  user: UserProfile | null;
  mode: "demo" | "firebase";
  signInDemo(displayName?: string): Promise<void>;
  signInEmail(email: string, password: string): Promise<void>;
  signUpEmail(email: string, password: string, displayName?: string): Promise<void>;
  signInGoogle(): Promise<void>;
  signOut(): Promise<void>;
  setPlan(plan: PlanId, extra?: Partial<UserProfile>): void;
}

const Ctx = createContext<AuthCtx | null>(null);

const DEMO_KEY = "barber.auth.demo.v1";

function readDemoUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DEMO_KEY);
    if (raw) return JSON.parse(raw) as UserProfile;
  } catch {}
  return null;
}

function writeDemoUser(u: UserProfile | null) {
  if (typeof window === "undefined") return;
  if (u) window.localStorage.setItem(DEMO_KEY, JSON.stringify(u));
  else window.localStorage.removeItem(DEMO_KEY);
}

function buildDemoProfile(email: string, displayName?: string): UserProfile {
  return {
    uid: `demo-${email.replace(/[^a-z0-9]/gi, "").slice(0, 12)}`,
    email,
    displayName: displayName ?? email.split("@")[0],
    createdAt: new Date().toISOString(),
    plan: "pro",
    shopSlug: "demo-shop",
    shopName: "Barber Studio Milano",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const mode: "demo" | "firebase" = isFirebaseConfigured ? "firebase" : "demo";
  const [status, setStatus] = useState<Status>("loading");
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (mode === "demo") {
      const existing = readDemoUser();
      setUser(existing);
      setStatus(existing ? "authed" : "guest");
      return;
    }
    let unsub: (() => void) | undefined;
    (async () => {
      const { auth } = getFirebase();
      if (!auth) {
        setStatus("guest");
        return;
      }
      const { onAuthStateChanged } = await import("firebase/auth");
      unsub = onAuthStateChanged(auth, async (fbUser) => {
        if (!fbUser) {
          setUser(null);
          setStatus("guest");
          return;
        }
        const profile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email ?? "",
          displayName: fbUser.displayName ?? undefined,
          createdAt: fbUser.metadata.creationTime ?? new Date().toISOString(),
          plan: "free",
          shopSlug: (fbUser.email ?? "shop").split("@")[0],
          shopName: fbUser.displayName ? `${fbUser.displayName} Barber` : "Il mio barbershop",
        };
        setUser(profile);
        setStatus("authed");
      });
    })();
    return () => {
      if (unsub) unsub();
    };
  }, [mode]);

  const setPlan = useCallback(
    (plan: PlanId, extra?: Partial<UserProfile>) => {
      setUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev, plan, ...extra };
        if (mode === "demo") writeDemoUser(next);
        return next;
      });
    },
    [mode],
  );

  const signInDemo = useCallback(async (displayName?: string) => {
    const email = "demo@rasoio.app";
    const u = buildDemoProfile(email, displayName ?? "Eros (demo)");
    writeDemoUser(u);
    setUser(u);
    setStatus("authed");
  }, []);

  const signInEmail = useCallback(
    async (email: string, password: string) => {
      if (mode === "demo") {
        const u = buildDemoProfile(email);
        writeDemoUser(u);
        setUser(u);
        setStatus("authed");
        return;
      }
      const { auth } = getFirebase();
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      if (!auth) throw new Error("Firebase non configurato");
      await signInWithEmailAndPassword(auth, email, password);
    },
    [mode],
  );

  const signUpEmail = useCallback(
    async (email: string, password: string, displayName?: string) => {
      if (mode === "demo") {
        const u = buildDemoProfile(email, displayName);
        writeDemoUser(u);
        setUser(u);
        setStatus("authed");
        return;
      }
      const { auth } = getFirebase();
      if (!auth) throw new Error("Firebase non configurato");
      const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) await updateProfile(cred.user, { displayName });
    },
    [mode],
  );

  const signInGoogle = useCallback(async () => {
    if (mode === "demo") {
      const u = buildDemoProfile("google.demo@rasoio.app", "Google Demo");
      writeDemoUser(u);
      setUser(u);
      setStatus("authed");
      return;
    }
    const { auth } = getFirebase();
    if (!auth) throw new Error("Firebase non configurato");
    const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }, [mode]);

  const signOut = useCallback(async () => {
    if (mode === "demo") {
      writeDemoUser(null);
      setUser(null);
      setStatus("guest");
      return;
    }
    const { auth } = getFirebase();
    if (!auth) return;
    const { signOut: fbSignOut } = await import("firebase/auth");
    await fbSignOut(auth);
  }, [mode]);

  const value = useMemo<AuthCtx>(
    () => ({ status, user, mode, signInDemo, signInEmail, signUpEmail, signInGoogle, signOut, setPlan }),
    [status, user, mode, signInDemo, signInEmail, signUpEmail, signInGoogle, signOut, setPlan],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
