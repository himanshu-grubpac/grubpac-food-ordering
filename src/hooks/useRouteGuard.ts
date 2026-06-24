"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCustomer } from "@/context/CustomerContext";

export function useRequireCustomer(redirectTo = "/") {
  const router = useRouter();
  const { isRegistered, isHydrated } = useCustomer();

  useEffect(() => {
    if (!isHydrated) return;
    if (!isRegistered) {
      router.replace(redirectTo);
    }
  }, [isHydrated, isRegistered, router, redirectTo]);

  return { isRegistered, isHydrated };
}

/** Redirect authenticated users away from guest-only routes (e.g. login). */
export function useRedirectIfRegistered(redirectTo = "/order") {
  const router = useRouter();
  const { isRegistered, isHydrated } = useCustomer();

  useEffect(() => {
    if (!isHydrated) return;
    if (isRegistered) {
      router.replace(redirectTo);
    }
  }, [isHydrated, isRegistered, router, redirectTo]);

  return { isRegistered, isHydrated };
}

export function useRequireCart(redirectTo = "/order") {
  const router = useRouter();
  const { items, isHydrated: isCartHydrated } = useCart();
  const { isRegistered, isHydrated: isCustomerHydrated } = useCustomer();
  const isHydrated = isCartHydrated && isCustomerHydrated;

  useEffect(() => {
    if (!isHydrated) return;
    if (!isRegistered) {
      router.replace("/");
      return;
    }
    if (items.length === 0) {
      router.replace(redirectTo);
    }
  }, [isHydrated, isRegistered, items.length, router, redirectTo]);

  return { hasItems: items.length > 0, isRegistered, isHydrated };
}

export function useRequireOrder(redirectTo = "/") {
  const router = useRouter();
  const { lastOrder, isHydrated } = useCart();

  useEffect(() => {
    if (!isHydrated) return;
    if (!lastOrder) {
      router.replace(redirectTo);
    }
  }, [isHydrated, lastOrder, router, redirectTo]);

  return { lastOrder, isHydrated };
}
