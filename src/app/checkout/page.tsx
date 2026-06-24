"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CustomerSummary } from "@/components/checkout/CustomerSummary";
import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector";
import { PriceBreakdown } from "@/components/checkout/PriceBreakdown";
import { useCart } from "@/context/CartContext";
import { useCustomer } from "@/context/CustomerContext";
import { useRequireCart } from "@/hooks/useRouteGuard";
import type { PaymentMethod } from "@/types/order";

export default function CheckoutPage() {
  const router = useRouter();
  const { customer } = useCustomer();
  const { items, subtotal, tax, grandTotal, placeOrder, clearCart } = useCart();
  const { isRegistered, hasItems, isHydrated } = useRequireCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!customer) return;
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    placeOrder(customer, paymentMethod);
    clearCart();
    router.replace("/track");
  };

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="h-96 animate-pulse rounded-2xl skeleton" />
      </div>
    );
  }

  if (!isRegistered || !customer) {
    return null;
  }

  if (!hasItems) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Checkout</h1>
        <p className="mt-2 text-muted-foreground">
          Review your order and complete payment to place it.
        </p>
      </motion.div>

      <div className="space-y-6">
        <CustomerSummary customer={customer} />
        <PriceBreakdown
          items={items}
          subtotal={subtotal}
          tax={tax}
          grandTotal={grandTotal}
        />
        <PaymentMethodSelector
          value={paymentMethod}
          onChange={setPaymentMethod}
        />

        <Button
          size="lg"
          className="w-full"
          onClick={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing Payment...
            </>
          ) : (
            "Place Order"
          )}
        </Button>
      </div>
    </div>
  );
}
