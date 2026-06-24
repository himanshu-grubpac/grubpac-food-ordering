import { CartSummary } from "@/components/cart/CartSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR } from "@/lib/utils";
import type { CartItem } from "@/types/cart";

interface PriceBreakdownProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  grandTotal: number;
}

export function PriceBreakdown({
  items,
  subtotal,
  tax,
  grandTotal,
}: PriceBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Price Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {items.map((entry) => (
            <div
              key={entry.item.id}
              className="flex justify-between gap-4 text-sm"
            >
              <span>
                {entry.item.name} x {entry.quantity}
              </span>
              <span>{formatINR(entry.item.price * entry.quantity)}</span>
            </div>
          ))}
        </div>
        <CartSummary subtotal={subtotal} tax={tax} grandTotal={grandTotal} />
      </CardContent>
    </Card>
  );
}
