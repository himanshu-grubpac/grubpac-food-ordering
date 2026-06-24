import type { CartItem } from "./cart";
import type { Customer } from "./customer";

export type PaymentMethod = "upi" | "credit_card" | "cash_on_delivery";

export interface Order {
  orderNumber: string;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  tax: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  placedAt: string;
  estimatedDeliveryMinutes: number;
}
