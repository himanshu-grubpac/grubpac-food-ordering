"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PackageSearch, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderDetailsCard } from "@/components/tracking/OrderDetailsCard";
import { OrderTrackingStatusCard } from "@/components/tracking/OrderTrackingStatusCard";
import { OrderTrackingTimeline } from "@/components/tracking/OrderTrackingTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useRequireCustomer } from "@/hooks/useRouteGuard";
import { useLogout } from "@/hooks/useLogout";
import { useOrderTracking } from "@/hooks/useOrderTracking";
import { getStoredOrder } from "@/lib/orderStorage";

export default function TrackOrderPage() {
  const { isRegistered, isHydrated: isCustomerHydrated } = useRequireCustomer();
  const { lastOrder, isHydrated: isCartHydrated } = useCart();
  const logout = useLogout();

  const isHydrated = isCustomerHydrated && isCartHydrated;
  const order = lastOrder ?? (isHydrated ? getStoredOrder() : null);
  const progress = useOrderTracking(order);

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="h-96 animate-pulse rounded-2xl skeleton" />
      </div>
    );
  }

  if (!isRegistered) {
    return null;
  }

  if (!order || !progress) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <PackageSearch className="h-7 w-7 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">No Active Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Place an order first, then come back here to track delivery live.
            </p>
            <Button asChild size="lg">
              <Link href="/order">
                Browse Menu
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-12 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Track Your Order
        </h1>
        <p className="mt-2 text-muted-foreground">
          Live updates from GrubPac Kitchen to your doorstep.
        </p>
      </motion.div>

      {progress.isDelivered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-700 dark:text-emerald-400"
        >
          <PartyPopper className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">
            Your order has been delivered. We hope you enjoy your meal!
          </p>
        </motion.div>
      )}

      <div className="space-y-6">
        <OrderTrackingStatusCard order={order} progress={progress} />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Delivery Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderTrackingTimeline progress={progress} />
          </CardContent>
        </Card>

        <OrderDetailsCard order={order} />

        {progress.isDelivered ? (
          <Button asChild size="lg" className="w-full">
            <Link href="/" onClick={logout}>
              Place New Order
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Status updates automatically every few seconds.
          </p>
        )}
      </div>
    </div>
  );
}
