"use client";

import { createContext, useContext } from "react";

export const DrawerCtx = createContext<() => void>(() => {});

export function useOpenNav() {
  return useContext(DrawerCtx);
}
