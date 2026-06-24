"use client";

import { motion } from "framer-motion";
import { VoiceAssistantCard } from "@/components/voice/VoiceAssistantCard";
import { MenuSearch } from "@/components/menu/MenuSearch";
import { CategoryFilter } from "@/components/menu/CategoryFilter";
import { MenuGrid } from "@/components/menu/MenuGrid";
import { CartPanel } from "@/components/cart/CartPanel";
import { MobileCartSheet } from "@/components/cart/MobileCartSheet";
import { useCustomer } from "@/context/CustomerContext";
import { useRequireCustomer } from "@/hooks/useRouteGuard";

export default function OrderPage() {
  const { customer } = useCustomer();
  const { isRegistered, isHydrated } = useRequireCustomer();

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="h-96 animate-pulse rounded-2xl skeleton" />
      </div>
    );
  }

  if (!isRegistered) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pb-28 sm:px-6 lg:pb-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome, {customer?.fullName}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Use your voice or browse the menu to build your order.
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <VoiceAssistantCard />
          <div className="space-y-4">
            <MenuSearch />
            <CategoryFilter />
          </div>
          <MenuGrid />
        </div>

        <div className="hidden lg:block">
          <CartPanel />
        </div>
      </div>

      <MobileCartSheet />
    </div>
  );
}
