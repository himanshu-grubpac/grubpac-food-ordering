import { NextResponse } from "next/server";

function getApiKey(): string | undefined {
  const key =
    process.env.DEEPGRAM_API_KEY?.trim() ??
    process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY?.trim();
  return key || undefined;
}

export async function GET() {
  const apiKey = getApiKey();

  if (!apiKey) {
    return NextResponse.json(
      { error: "Deepgram API key is not configured on the server." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch("https://api.deepgram.com/v1/auth/grant", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ttl_seconds: 300 }),
      cache: "no-store",
    });

    if (!response.ok) {
      const details = await response.text();
      const message =
        process.env.NODE_ENV === "development"
          ? `Grant failed (${response.status}): ${details.slice(0, 200)}`
          : "Token grant unavailable. Client will use API key fallback.";

      return NextResponse.json({ error: message }, { status: 502 });
    }

    const data = (await response.json()) as { access_token?: string };
    if (!data.access_token) {
      return NextResponse.json(
        { error: "Grant response did not include an access token." },
        { status: 502 }
      );
    }

    return NextResponse.json({ token: data.access_token });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown grant error";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `Failed to create Deepgram session token: ${message}`
            : "Failed to create Deepgram session token.",
      },
      { status: 502 }
    );
  }
}
