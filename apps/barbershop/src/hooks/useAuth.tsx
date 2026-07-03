"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "@/lib/firebase";
import { getShopByOwner, createShop } from "@/lib/firestore";
import type { BarberShop } from "@/types";

interface AuthContextType {
  user: User | null;
  shop: BarberShop | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, shopName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshShop: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [shop, setShop] = useState<BarberShop | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadShop(u: User) {
    const s = await getShopByOwner(u.uid);
    setShop(s);
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        await loadShop(u);
      } else {
        setShop(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    const existingShop = await getShopByOwner(result.user.uid);
    if (!existingShop) {
      const shopName = result.user.displayName
        ? `Barbershop di ${result.user.displayName.split(" ")[0]}`
        : "Il Mio Barbershop";
      const newShop = await createShop(result.user.uid, shopName);
      setShop(newShop);
    } else {
      setShop(existingShop);
    }
  }

  async function signInWithEmail(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signUpWithEmail(email: string, password: string, shopName: string) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const newShop = await createShop(result.user.uid, shopName);
    setShop(newShop);
  }

  async function logout() {
    await signOut(auth);
    setShop(null);
  }

  async function refreshShop() {
    if (user) await loadShop(user);
  }

  return (
    <AuthContext.Provider
      value={{ user, shop, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, logout, refreshShop }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
