import { NextRequest, NextResponse } from "next/server";
import { AI_PROVIDERS } from "@/lib/providers";
import { getAdapter } from "@/lib/ai/adapters";
import type { StreamRequest } from "@/lib/ai/types";

export async function POST(request: NextRequest) {
  let apiKey: string | undefined;

  try {
    const body: StreamRequest = await request.json();
    apiKey = body.apiKey;

    if (!body.providerId || !body.modelId || !body.question || !apiKey) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const provider = AI_PROVIDERS.find((p) => p.id === body.providerId);
    if (!provider) {
      return NextResponse.json(
        { error: "Unknown provider" },
        { status: 400 }
      );
    }

    const adapter = getAdapter(provider.apiType);
    const stream = await adapter(
      body.modelId,
      body.question,
      apiKey,
      provider.baseUrl,
      request.signal
    );

    // Immediately discard the API key from scope
    apiKey = undefined;

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    // Ensure API key is discarded even on error
    apiKey = undefined;

    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
