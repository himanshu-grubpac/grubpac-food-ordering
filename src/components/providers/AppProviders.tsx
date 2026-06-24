"use client";

import { CustomerProvider } from "@/context/CustomerContext";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <CustomerProvider>
        <CartProvider>
          {children}
          <Toaster richColors position="top-center" />
        </CartProvider>
      </CustomerProvider>
    </ThemeProvider>
  );
}
