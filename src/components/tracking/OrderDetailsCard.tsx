import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR } from "@/lib/utils";
import type { Order } from "@/types/order";

interface OrderDetailsCardProps {
  order: Order;
}

const paymentLabels: Record<Order["paymentMethod"], string> = {
  upi: "UPI",
  credit_card: "Credit Card",
  cash_on_delivery: "Cash on Delivery",
};

export function OrderDetailsCard({ order }: OrderDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Order Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="surface-muted rounded-xl p-3">
            <p className="text-xs text-muted-foreground">Customer</p>
            <p className="font-medium text-foreground">{order.customer.fullName}</p>
          </div>
          <div className="surface-muted rounded-xl p-3">
            <p className="text-xs text-muted-foreground">Mobile</p>
            <p className="font-medium text-foreground">{order.customer.mobile}</p>
          </div>
        </div>

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

        <div className="flex justify-between border-t border-border pt-3 text-sm">
          <span className="text-muted-foreground">Payment</span>
          <span className="font-medium">{paymentLabels[order.paymentMethod]}</span>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <span>Total Paid</span>
          <span className="text-primary">{formatINR(order.grandTotal)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
