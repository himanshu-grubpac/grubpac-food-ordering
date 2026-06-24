"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomer } from "@/context/CustomerContext";
import { SITE_NAME } from "@/lib/branding";

export function RegistrationForm() {
  const router = useRouter();
  const { setCustomer } = useCustomer();
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ fullName?: string; mobile?: string }>({});

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: { fullName?: string; mobile?: string } = {};

    if (!fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!mobile.trim()) {
      nextErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(mobile.replace(/\D/g, "").slice(-10))) {
      nextErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setCustomer({
      fullName: fullName.trim(),
      mobile: mobile.replace(/\D/g, "").slice(-10),
      email: email.trim() || undefined,
    });
    router.push("/order");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg"
    >
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Login to {SITE_NAME}</CardTitle>
          <CardDescription>
            Enter your details to access voice-powered food ordering.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                aria-invalid={Boolean(errors.fullName)}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                aria-invalid={Boolean(errors.mobile)}
              />
              {errors.mobile && (
                <p className="text-sm text-destructive">{errors.mobile}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Login
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
