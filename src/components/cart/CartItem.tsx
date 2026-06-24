"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";
import type { CartItem } from "@/types/cart";

interface CartItemRowProps {
  entry: CartItem;
}

export function CartItemRow({ entry }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="surface-muted flex items-start justify-between gap-3 rounded-xl p-3">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{entry.item.name}</p>
        <p className="text-sm text-muted-foreground">
          {formatINR(entry.item.price)} each
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(entry.item.id, -1)}
            aria-label={`Decrease ${entry.item.name} quantity`}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center text-sm font-medium">
            {entry.quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(entry.item.id, 1)}
            aria-label={`Increase ${entry.item.name} quantity`}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            {formatINR(entry.item.price * entry.quantity)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => removeItem(entry.item.id)}
            aria-label={`Remove ${entry.item.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
