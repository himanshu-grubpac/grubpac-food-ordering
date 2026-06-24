"use client";

import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { GrubPacLogo } from "@/components/layout/GrubPacLogo";
import { useRedirectIfRegistered } from "@/hooks/useRouteGuard";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/branding";

export function LoginPage() {
  const { isRegistered, isHydrated } = useRedirectIfRegistered();

  if (!isHydrated) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6">
        <div className="h-96 w-full max-w-lg animate-pulse rounded-2xl skeleton" />
      </div>
    );
  }

  if (isRegistered) {
    return null;
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.18),transparent_35%)]" />
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col items-center justify-center px-4 py-12 sm:px-6">
        <div className="mb-10 flex max-w-2xl flex-col items-center text-center">
          <GrubPacLogo size="lg" className="mb-6" />
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Enterprise Demo
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {SITE_NAME}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {SITE_TAGLINE}. Login once, then order your favorite meals using
            natural voice commands.
          </p>
        </div>
        <RegistrationForm />
      </div>
    </div>
  );
}
