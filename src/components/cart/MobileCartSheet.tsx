"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartPanel } from "@/components/cart/CartPanel";
import { useCart } from "@/context/CartContext";

export function MobileCartSheet() {
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button size="lg" className="w-full shadow-2xl">
            <ShoppingCart className="h-5 w-5" />
            View Cart
            {itemCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {itemCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <CartPanel />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
