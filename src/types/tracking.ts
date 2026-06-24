export type OrderTrackingStatus =
  | "order_confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered";

export interface TrackingStep {
  status: OrderTrackingStatus;
  title: string;
  description: string;
  afterSeconds: number;
}

export interface TrackingProgress {
  currentStatus: OrderTrackingStatus;
  currentStepIndex: number;
  steps: TrackingStep[];
  estimatedDelivery: Date;
  isDelivered: boolean;
  progressPercent: number;
}
