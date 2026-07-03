"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthUser } from "../types";
import { firebaseEnabled } from "../firebase/config";
import { getFirebaseAuth } from "../firebase/client";

const DEMO_KEY = "barberpro:demo-user";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  firebaseEnabled: boolean;
  signInDemo: () => void;
  signInEmail: (email: string, password: string) => Promise<void>;
  registerEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | undefined;

    async function init() {
      if (firebaseEnabled) {
        const auth = getFirebaseAuth();
        if (auth) {
          const { onAuthStateChanged } = await import("firebase/auth");
          unsub = onAuthStateChanged(auth, (fbUser) => {
            setUser(
              fbUser
                ? {
                    uid: fbUser.uid,
                    email: fbUser.email,
                    displayName: fbUser.displayName,
                    isDemo: false,
                  }
                : null,
            );
            setLoading(false);
          });
          return;
        }
      }
      // Modalità demo: recupera l'utente demo dal localStorage.
      try {
        const raw = window.localStorage.getItem(DEMO_KEY);
        if (raw) setUser(JSON.parse(raw) as AuthUser);
      } catch {
        // ignore
      }
      setLoading(false);
    }

    init();
    return () => unsub?.();
  }, []);

  const signInDemo = useCallback(() => {
    const demoUser: AuthUser = {
      uid: "demo-user",
      email: "demo@barberpro.app",
      displayName: "Barbiere Demo",
      isDemo: true,
    };
    window.localStorage.setItem(DEMO_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
  }, []);

  const signInEmail = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase non configurato");
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const registerEmail = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase non configurato");
    const { createUserWithEmailAndPassword } = await import("firebase/auth");
    await createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const signOut = useCallback(async () => {
    if (firebaseEnabled) {
      const auth = getFirebaseAuth();
      if (auth) {
        const { signOut: fbSignOut } = await import("firebase/auth");
        await fbSignOut(auth);
      }
    }
    window.localStorage.removeItem(DEMO_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        firebaseEnabled,
        signInDemo,
        signInEmail,
        registerEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve essere usato dentro <AuthProvider>");
  return ctx;
}
