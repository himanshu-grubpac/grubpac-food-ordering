import type { Order } from "@/types/order";

export const ORDER_STORAGE_KEY = "grubpac-last-order";

export function getStoredOrder(): Order | null {
  if (typeof window === "undefined") return null;

  try {
    const storedOrder = sessionStorage.getItem(ORDER_STORAGE_KEY);
    return storedOrder ? (JSON.parse(storedOrder) as Order) : null;
  } catch {
    sessionStorage.removeItem(ORDER_STORAGE_KEY);
    return null;
  }
}

export function setStoredOrder(order: Order): void {
  sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
}

export function clearStoredOrder(): void {
  sessionStorage.removeItem(ORDER_STORAGE_KEY);
}
