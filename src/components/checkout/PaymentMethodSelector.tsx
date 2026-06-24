"use client";

import type { ReactNode } from "react";
import { Banknote, CreditCard, Smartphone } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PaymentMethod } from "@/types/order";
import { cn } from "@/lib/utils";

const methods: {
  value: PaymentMethod;
  label: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    value: "upi",
    label: "UPI",
    description: "Pay instantly via UPI apps",
    icon: <Smartphone className="h-5 w-5" />,
  },
  {
    value: "credit_card",
    label: "Credit Card",
    description: "Visa, Mastercard, RuPay",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    value: "cash_on_delivery",
    label: "Cash on Delivery",
    description: "Pay when your order arrives",
    icon: <Banknote className="h-5 w-5" />,
  },
];

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

export function PaymentMethodSelector({
  value,
  onChange,
}: PaymentMethodSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={value}
          onValueChange={(next) => onChange(next as PaymentMethod)}
          className="gap-3"
        >
          {methods.map((method) => (
            <Label
              key={method.value}
              htmlFor={method.value}
              className={cn(
                "flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent dark:bg-secondary/60 dark:hover:bg-accent",
                value === method.value && "border-primary bg-primary/5"
              )}
            >
              <RadioGroupItem value={method.value} id={method.value} />
              <div className="text-primary">{method.icon}</div>
              <div className="flex-1">
                <p className="font-medium">{method.label}</p>
                <p className="text-sm text-muted-foreground">
                  {method.description}
                </p>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
