"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fbAuth, firebaseConfigured } from "@/lib/firebase/client";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isDemo: boolean;
}

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  isDemo: boolean;
  signInDemo: (name?: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

const DEMO_KEY = "barberpro.demoUser";

function readDemoUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(DEMO_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemo = !firebaseConfigured();

  useEffect(() => {
    if (isDemo) {
      setUser(readDemoUser());
      setLoading(false);
      return;
    }
    const auth = fbAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    // dynamic import per evitare esecuzione se firebase non è configurato
    let unsub: (() => void) | undefined;
    (async () => {
      const { onAuthStateChanged } = await import("firebase/auth");
      unsub = onAuthStateChanged(auth, (u) => {
        if (u) {
          setUser({
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            isDemo: false,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
    })();
    return () => {
      if (unsub) unsub();
    };
  }, [isDemo]);

  const signInDemo = useCallback(async (name?: string) => {
    const demoUser: AuthUser = {
      uid: "demo-user",
      email: "demo@barberpro.app",
      displayName: name ?? "Barbiere Demo",
      isDemo: true,
    };
    window.localStorage.setItem(DEMO_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
  }, []);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      if (isDemo) {
        await signInDemo(email.split("@")[0]);
        return;
      }
      const auth = fbAuth();
      if (!auth) throw new Error("Auth non disponibile");
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      await signInWithEmailAndPassword(auth, email, password);
    },
    [isDemo, signInDemo],
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string, name: string) => {
      if (isDemo) {
        await signInDemo(name);
        return;
      }
      const auth = fbAuth();
      if (!auth) throw new Error("Auth non disponibile");
      const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
    },
    [isDemo, signInDemo],
  );

  const signOut = useCallback(async () => {
    if (isDemo) {
      window.localStorage.removeItem(DEMO_KEY);
      setUser(null);
      return;
    }
    const auth = fbAuth();
    if (!auth) return;
    const { signOut: fbSignOut } = await import("firebase/auth");
    await fbSignOut(auth);
  }, [isDemo]);

  const value = useMemo<AuthCtx>(
    () => ({ user, loading, isDemo, signInDemo, signInWithEmail, signUpWithEmail, signOut }),
    [user, loading, isDemo, signInDemo, signInWithEmail, signUpWithEmail, signOut],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
}
