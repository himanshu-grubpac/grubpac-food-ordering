import type { Customer } from "@/types/customer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerSummaryProps {
  customer: Customer;
}

export function CustomerSummary({ customer }: CustomerSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Customer Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Name</span>
          <span className="font-medium text-foreground">{customer.fullName}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Mobile</span>
          <span className="font-medium text-foreground">{customer.mobile}</span>
        </div>
        {customer.email && (
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium text-foreground">{customer.email}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
