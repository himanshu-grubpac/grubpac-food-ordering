import { formatINR } from "@/lib/utils";

interface CartSummaryProps {
  subtotal: number;
  tax: number;
  grandTotal: number;
}

export function CartSummary({ subtotal, tax, grandTotal }: CartSummaryProps) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Subtotal</span>
        <span>{formatINR(subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">GST (5%)</span>
        <span>{formatINR(tax)}</span>
      </div>
      <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
        <span>Grand Total</span>
        <span className="text-primary">{formatINR(grandTotal)}</span>
      </div>
    </div>
  );
}
