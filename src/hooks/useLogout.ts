"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCustomer } from "@/context/CustomerContext";

export function useLogout() {
  const router = useRouter();
  const { clearCustomer } = useCustomer();
  const { clearCart, clearLastOrder } = useCart();

  return useCallback(() => {
    router.replace("/");
    window.setTimeout(() => {
      clearCustomer();
      clearCart();
      clearLastOrder();
    }, 0);
  }, [router, clearCustomer, clearCart, clearLastOrder]);
}
