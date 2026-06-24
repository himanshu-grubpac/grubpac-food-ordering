import type { AuthConfig } from "@deepgram/agents";

function getPublicApiKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY?.trim();
  return key || undefined;
}

async function fetchGrantToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/deepgram/token");
    if (!response.ok) return null;

    const data = (await response.json()) as { token?: string };
    return data.token?.trim() || null;
  } catch {
    return null;
  }
}

export function hasVoiceAgentCredentials(): boolean {
  return Boolean(getPublicApiKey());
}

/**
 * Demo apps with NEXT_PUBLIC_DEEPGRAM_API_KEY connect directly (same as prior STT).
 * Production can use DEEPGRAM_API_KEY + /api/deepgram/token grant only.
 */
export async function resolveAgentAuth(): Promise<AuthConfig> {
  const publicKey = getPublicApiKey();
  if (publicKey) {
    return { apiKey: publicKey };
  }

  const grantToken = await fetchGrantToken();
  if (grantToken) {
    return {
      tokenFactory: async () => {
        const fresh = await fetchGrantToken();
        if (fresh) return fresh;
        throw new Error("Could not refresh Deepgram session token.");
      },
    };
  }

  throw new Error(
    "Add NEXT_PUBLIC_DEEPGRAM_API_KEY to .env.local and restart the dev server."
  );
}
