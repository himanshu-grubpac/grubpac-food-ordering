"use client";

import { useSyncExternalStore } from "react";

const STORAGE_CHANGE_EVENT = "grubpac-storage-change";

export function notifySessionStorageChange() {
  window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(STORAGE_CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(STORAGE_CHANGE_EVENT, handler);
  };
}

/** Returns the raw sessionStorage string so getSnapshot stays referentially stable. */
export function useSessionStorageRaw(key: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => sessionStorage.getItem(key),
    () => null
  );
}

export function useIsClientHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
