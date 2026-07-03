"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { getFirebaseAuth } from "./firebase-client";
import { isFirebaseConfigured } from "./firebase-config";

export type AuthUser = {
  uid: string;
  email: string;
  displayName?: string;
  isDemo: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signUp: (email: string, password: string, name?: string) => Promise<AuthUser>;
  signInDemo: () => Promise<AuthUser>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const DEMO_USER_KEY = "filo:demo:user";

function toAuthUser(u: FirebaseUser): AuthUser {
  return {
    uid: u.uid,
    email: u.email ?? "",
    displayName: u.displayName ?? undefined,
    isDemo: false,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured) {
      const auth = getFirebaseAuth();
      if (!auth) {
        setLoading(false);
        return;
      }
      const unsub = onAuthStateChanged(auth, (u) => {
        setUser(u ? toAuthUser(u) : null);
        setLoading(false);
      });
      return () => unsub();
    }
    try {
      const raw = window.localStorage.getItem(DEMO_USER_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (isFirebaseConfigured) {
      const auth = getFirebaseAuth();
      if (!auth) throw new Error("Firebase auth non inizializzato");
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return toAuthUser(cred.user);
    }
    const demo: AuthUser = { uid: "demo-user", email, isDemo: true };
    window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demo));
    setUser(demo);
    return demo;
  }, []);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    if (isFirebaseConfigured) {
      const auth = getFirebaseAuth();
      if (!auth) throw new Error("Firebase auth non inizializzato");
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      return toAuthUser(cred.user);
    }
    const demo: AuthUser = { uid: "demo-user", email, displayName: name, isDemo: true };
    window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demo));
    setUser(demo);
    return demo;
  }, []);

  const signInDemo = useCallback(async () => {
    const demo: AuthUser = {
      uid: "demo-user",
      email: "demo@filo.app",
      displayName: "Antonio (Demo)",
      isDemo: true,
    };
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demo));
    }
    setUser(demo);
    return demo;
  }, []);

  const signOut = useCallback(async () => {
    if (isFirebaseConfigured) {
      const auth = getFirebaseAuth();
      if (auth) await fbSignOut(auth);
    }
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(DEMO_USER_KEY);
    }
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isDemo: !isFirebaseConfigured,
      signIn,
      signUp,
      signInDemo,
      signOut,
    }),
    [user, loading, signIn, signUp, signInDemo, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve essere usato dentro AuthProvider");
  return ctx;
}
