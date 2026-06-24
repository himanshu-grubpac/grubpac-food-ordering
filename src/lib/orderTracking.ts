import type { OrderTrackingStatus, TrackingProgress, TrackingStep } from "@/types/tracking";

export const TRACKING_STEPS: TrackingStep[] = [
  {
    status: "order_confirmed",
    title: "Order Confirmed",
    description: "Payment received and your order is in our system.",
    afterSeconds: 0,
  },
  {
    status: "preparing",
    title: "Preparing Food",
    description: "Our kitchen team is cooking your fresh meal.",
    afterSeconds: 5,
  },
  {
    status: "ready",
    title: "Ready for Pickup",
    description: "Your order is packed and waiting for the delivery partner.",
    afterSeconds: 12,
  },
  {
    status: "out_for_delivery",
    title: "Out for Delivery",
    description: "Your rider is on the way to your location.",
    afterSeconds: 20,
  },
  {
    status: "delivered",
    title: "Delivered",
    description: "Order delivered successfully. Enjoy your meal!",
    afterSeconds: 32,
  },
];

export function getTrackingProgress(
  placedAtIso: string,
  estimatedDeliveryMinutes = 35,
  nowMs = Date.now()
): TrackingProgress {
  const placedAt = new Date(placedAtIso);
  const elapsedSeconds = Math.max(
    0,
    Math.floor((nowMs - placedAt.getTime()) / 1000)
  );

  let currentStepIndex = 0;
  for (let i = TRACKING_STEPS.length - 1; i >= 0; i--) {
    if (elapsedSeconds >= TRACKING_STEPS[i].afterSeconds) {
      currentStepIndex = i;
      break;
    }
  }

  const currentStatus = TRACKING_STEPS[currentStepIndex].status;
  const isDelivered = currentStatus === "delivered";
  const estimatedDelivery = new Date(
    placedAt.getTime() + estimatedDeliveryMinutes * 60 * 1000
  );

  const maxSeconds = TRACKING_STEPS[TRACKING_STEPS.length - 1].afterSeconds;
  const progressPercent = Math.min(
    100,
    Math.round((elapsedSeconds / maxSeconds) * 100)
  );

  return {
    currentStatus,
    currentStepIndex,
    steps: TRACKING_STEPS,
    estimatedDelivery,
    isDelivered,
    progressPercent,
  };
}

export function getStatusLabel(status: OrderTrackingStatus): string {
  return TRACKING_STEPS.find((step) => step.status === status)?.title ?? status;
}

export function formatDeliveryTime(date: Date): string {
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
