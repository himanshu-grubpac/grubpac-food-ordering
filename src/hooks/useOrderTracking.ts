"use client";

import { useEffect, useMemo, useState } from "react";
import type { Order } from "@/types/order";
import type { TrackingProgress } from "@/types/tracking";
import { getTrackingProgress } from "@/lib/orderTracking";

export function useOrderTracking(order: Order | null): TrackingProgress | null {
  const placedAt = useMemo(() => {
    if (!order) return null;
    return order.placedAt ?? new Date().toISOString();
  }, [order]);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!order || !placedAt) return;

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [order, placedAt]);

  if (!order || !placedAt) return null;

  return getTrackingProgress(
    placedAt,
    order.estimatedDeliveryMinutes ?? 35,
    now
  );
}
