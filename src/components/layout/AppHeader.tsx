"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Mic } from "lucide-react";
import { GrubPacLogo } from "@/components/layout/GrubPacLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useCustomer } from "@/context/CustomerContext";
import { useLogout } from "@/hooks/useLogout";
import { SITE_TAGLINE } from "@/lib/branding";
import { cn } from "@/lib/utils";

const steps = [
  { href: "/", label: "Login", guestOnly: true },
  { href: "/order", label: "Order", requiresAuth: true },
  { href: "/checkout", label: "Checkout", requiresAuth: true },
  { href: "/track", label: "Track", requiresAuth: true },
  { href: "/success", label: "Done", requiresAuth: true },
] as const;

function isStepEnabled(
  step: (typeof steps)[number],
  canAccessProtected: boolean
): boolean {
  if ("guestOnly" in step && step.guestOnly) {
    return !canAccessProtected;
  }
  if ("requiresAuth" in step && step.requiresAuth) {
    return canAccessProtected;
  }
  return true;
}

function NavStep({
  href,
  label,
  active,
  enabled,
  className,
}: {
  href: string;
  label: string;
  active: boolean;
  enabled: boolean;
  className?: string;
}) {
  const badge = (
    <Badge
      variant={active ? "default" : "glass"}
      className={cn(
        "px-3 py-1",
        active && enabled && "shadow-lg",
        enabled
          ? "cursor-pointer transition-opacity hover:opacity-90"
          : "cursor-not-allowed opacity-50"
      )}
      aria-disabled={!enabled}
    >
      {label}
    </Badge>
  );

  if (!enabled) {
    return <div className={className}>{badge}</div>;
  }

  return (
    <Link href={href} className={className}>
      {badge}
    </Link>
  );
}

export function AppHeader() {
  const pathname = usePathname();
  const { isRegistered, isHydrated: isCustomerHydrated } = useCustomer();
  const { isHydrated: isCartHydrated } = useCart();
  const logout = useLogout();

  const isHydrated = isCustomerHydrated && isCartHydrated;
  const canAccessProtected = isHydrated && isRegistered;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href={canAccessProtected ? "/order" : "/"}
          className="flex items-center gap-3"
        >
          <GrubPacLogo size="md" />
          <div className="hidden sm:block">
            <p className="text-xs text-muted-foreground">{SITE_TAGLINE}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Progress">
          {steps.map((step) => (
            <NavStep
              key={step.href}
              href={step.href}
              label={step.label}
              active={pathname === step.href}
              enabled={isStepEnabled(step, canAccessProtected)}
            />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Badge variant="glass" className="hidden sm:inline-flex gap-1">
            <Mic className="h-3 w-3" />
            Voice Enabled
          </Badge>
          {canAccessProtected && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>

      <nav
        className="flex gap-2 overflow-x-auto border-t border-border px-4 py-2 md:hidden"
        aria-label="Mobile progress"
      >
        {steps.map((step) => (
          <NavStep
            key={step.href}
            href={step.href}
            label={step.label}
            active={pathname === step.href}
            enabled={isStepEnabled(step, canAccessProtected)}
            className="shrink-0"
          />
        ))}
      </nav>
    </header>
  );
}
