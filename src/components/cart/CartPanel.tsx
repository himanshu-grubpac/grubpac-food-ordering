"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CartItemRow } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/context/CartContext";

interface CartPanelProps {
  showCheckout?: boolean;
}

export function CartPanel({ showCheckout = true }: CartPanelProps) {
  const { items, subtotal, tax, grandTotal, itemCount } = useCart();

  return (
    <Card id="cart-panel" className="sticky top-24 h-fit shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Your Cart
          </CardTitle>
          <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
            {itemCount} items
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="empty-state rounded-xl px-4 py-10 text-center">
            <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="font-medium">Your cart is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try saying &quot;Add burger&quot; or &quot;Place my order&quot;.
            </p>
          </div>
        ) : (
          items.map((entry) => (
            <CartItemRow key={entry.item.id} entry={entry} />
          ))
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <CartSummary subtotal={subtotal} tax={tax} grandTotal={grandTotal} />
        {showCheckout && (
          <Button asChild className="w-full" size="lg" disabled={items.length === 0}>
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
