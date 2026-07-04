import type { DoorInput } from "./types";

const KEY = "porte:ordini";

export interface SavedOrder {
  id: string;
  commessa: string;
  cliente: string;
  createdAt: number;
  input: DoorInput;
}

function safeParse(raw: string | null): SavedOrder[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? (data as SavedOrder[]) : [];
  } catch {
    return [];
  }
}

export function loadOrders(): SavedOrder[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(KEY)).sort(
    (a, b) => b.createdAt - a.createdAt
  );
}

export function saveOrder(order: SavedOrder): SavedOrder[] {
  const orders = loadOrders().filter((o) => o.id !== order.id);
  orders.unshift(order);
  window.localStorage.setItem(KEY, JSON.stringify(orders));
  return orders;
}

export function removeOrder(id: string): SavedOrder[] {
  const orders = loadOrders().filter((o) => o.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(orders));
  return orders;
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
