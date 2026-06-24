"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import {
  notifySessionStorageChange,
  useIsClientHydrated,
  useSessionStorageRaw,
} from "@/hooks/useSessionStorage";
import type { Customer } from "@/types/customer";

const STORAGE_KEY = "grubpac-customer";

function parseCustomer(raw: string | null): Customer | null {
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Customer;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

interface CustomerContextValue {
  customer: Customer | null;
  isRegistered: boolean;
  isHydrated: boolean;
  setCustomer: (customer: Customer) => void;
  clearCustomer: () => void;
}

const CustomerContext = createContext<CustomerContextValue | null>(null);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const storedRaw = useSessionStorageRaw(STORAGE_KEY);
  const isHydrated = useIsClientHydrated();

  const customer = useMemo(() => parseCustomer(storedRaw), [storedRaw]);

  const setCustomer = useCallback((next: Customer) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    notifySessionStorageChange();
  }, []);

  const clearCustomer = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    notifySessionStorageChange();
  }, []);

  const value = useMemo(
    () => ({
      customer,
      isRegistered: Boolean(customer?.fullName && customer?.mobile),
      isHydrated,
      setCustomer,
      clearCustomer,
    }),
    [customer, isHydrated, setCustomer, clearCustomer]
  );

  return (
    <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within CustomerProvider");
  }
  return context;
}
