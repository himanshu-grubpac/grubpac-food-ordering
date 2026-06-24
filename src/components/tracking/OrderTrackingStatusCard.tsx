"use client";

import { motion } from "framer-motion";
import { Clock, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDeliveryTime, getStatusLabel } from "@/lib/orderTracking";
import type { TrackingProgress } from "@/types/tracking";
import type { Order } from "@/types/order";

interface OrderTrackingStatusCardProps {
  order: Order;
  progress: TrackingProgress;
}

export function OrderTrackingStatusCard({
  order,
  progress,
}: OrderTrackingStatusCardProps) {
  return (
    <Card className="overflow-hidden border-primary/30">
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="text-xl font-bold text-primary">{order.orderNumber}</p>
          </div>
          <motion.div
            animate={{ x: progress.isDelivered ? 0 : [0, 6, 0] }}
            transition={{ duration: 2, repeat: progress.isDelivered ? 0 : Infinity }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary"
          >
            <Truck className="h-6 w-6" />
          </motion.div>
        </div>

        <motion.div
          key={progress.currentStatus}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <p className="text-sm text-muted-foreground">Current Status</p>
          <p className="text-2xl font-bold text-foreground">
            {getStatusLabel(progress.currentStatus)}
          </p>
        </motion.div>

        <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress.progressPercent}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0 text-primary" />
          {progress.isDelivered ? (
            <span>Delivered to {order.customer.fullName}</span>
          ) : (
            <span>
              Estimated delivery by{" "}
              <strong className="text-foreground">
                {formatDeliveryTime(progress.estimatedDelivery)}
              </strong>
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
