"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SuccessAnimation } from "@/components/success/SuccessAnimation";
import { useCart } from "@/context/CartContext";
import { useRequireCustomer } from "@/hooks/useRouteGuard";
import { useLogout } from "@/hooks/useLogout";
import { getStoredOrder } from "@/lib/orderStorage";
import { formatINR } from "@/lib/utils";

export default function SuccessPage() {
  const { isRegistered, isHydrated: isCustomerHydrated } = useRequireCustomer();
  const { lastOrder, isHydrated: isCartHydrated } = useCart();
  const logout = useLogout();

  const isHydrated = isCustomerHydrated && isCartHydrated;
  const order = lastOrder ?? (isHydrated ? getStoredOrder() : null);

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="h-80 animate-pulse rounded-2xl skeleton" />
      </div>
    );
  }

  if (!isRegistered) {
    return null;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="h-80 animate-pulse rounded-2xl skeleton" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="overflow-hidden border-emerald-500/30 text-center shadow-2xl dark:border-emerald-500/40">
          <CardHeader className="pb-0">
            <SuccessAnimation />
            <CardTitle className="text-3xl text-foreground">Order Placed Successfully!</CardTitle>
            <p className="text-muted-foreground">
              Thank you for ordering with GrubPac Kitchen.
            </p>
          </CardHeader>
          <CardContent className="space-y-6 pt-6 text-left">
            <div className="surface-muted rounded-xl p-4">
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="text-xl font-bold text-primary">
                {order.orderNumber}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="surface-muted rounded-xl p-4">
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-semibold text-foreground">{order.customer.fullName}</p>
              </div>
              <div className="surface-muted rounded-xl p-4">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-semibold text-foreground">{formatINR(order.grandTotal)}</p>
              </div>
            </div>

            <div className="surface-muted rounded-xl p-4">
              <p className="mb-3 text-sm font-medium text-muted-foreground">
                Items Ordered
              </p>
              <div className="space-y-2">
                {order.items.map((entry) => (
                  <div
                    key={entry.item.id}
                    className="flex justify-between gap-4 text-sm text-foreground"
                  >
                    <span>
                      {entry.item.name} x {entry.quantity}
                    </span>
                    <span>{formatINR(entry.item.price * entry.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:flex-1">
                <Link href="/track">
                  <MapPin className="h-4 w-4" />
                  Track Order
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:flex-1">
                <Link href="/" onClick={logout}>
                  Place New Order
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
