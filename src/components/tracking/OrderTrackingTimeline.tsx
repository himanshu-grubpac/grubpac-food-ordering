"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ChefHat,
  MapPin,
  Package,
  ShoppingBag,
} from "lucide-react";
import type { TrackingProgress } from "@/types/tracking";
import type { OrderTrackingStatus } from "@/types/tracking";
import { cn } from "@/lib/utils";

const stepIcons: Record<OrderTrackingStatus, ReactNode> = {
  order_confirmed: <ShoppingBag className="h-5 w-5" />,
  preparing: <ChefHat className="h-5 w-5" />,
  ready: <Package className="h-5 w-5" />,
  out_for_delivery: <MapPin className="h-5 w-5" />,
  delivered: <Check className="h-5 w-5" />,
};

interface OrderTrackingTimelineProps {
  progress: TrackingProgress;
}

export function OrderTrackingTimeline({ progress }: OrderTrackingTimelineProps) {
  return (
    <ol className="relative space-y-0" aria-label="Order tracking progress">
      {progress.steps.map((step, index) => {
        const isComplete = index < progress.currentStepIndex;
        const isCurrent = index === progress.currentStepIndex;
        const isUpcoming = index > progress.currentStepIndex;

        return (
          <li key={step.status} className="relative flex gap-4 pb-10 last:pb-0">
            {index < progress.steps.length - 1 && (
              <span
                className={cn(
                  "absolute left-5 top-10 h-[calc(100%-2rem)] w-0.5 -translate-x-1/2",
                  isComplete ? "bg-primary" : "bg-border"
                )}
                aria-hidden
              />
            )}

            <motion.div
              initial={false}
              animate={
                isCurrent
                  ? { scale: [1, 1.08, 1], boxShadow: "0 0 0 0px transparent" }
                  : { scale: 1 }
              }
              transition={
                isCurrent
                  ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                  : undefined
              }
              className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2",
                isComplete && "border-primary bg-primary text-primary-foreground",
                isCurrent &&
                  "border-primary bg-primary/15 text-primary ring-4 ring-primary/20",
                isUpcoming && "border-border bg-muted text-muted-foreground"
              )}
            >
              {isComplete ? <Check className="h-5 w-5" /> : stepIcons[step.status]}
            </motion.div>

            <div className="min-w-0 flex-1 pt-1">
              <p
                className={cn(
                  "font-semibold",
                  isUpcoming ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {step.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {step.description}
              </p>
              {isCurrent && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm font-medium text-primary"
                  role="status"
                >
                  In progress...
                </motion.p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
