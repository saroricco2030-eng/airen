import { SSEParser } from "./sse-parser";
import type { AdapterFn } from "./types";

export const anthropicAdapter: AdapterFn = async (
  modelId,
  question,
  apiKey,
  baseUrl,
  signal
) => {
  const response = await fetch(`${baseUrl}/v1/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: 4096,
      stream: true,
      messages: [{ role: "user", content: question }],
    }),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`${response.status}: ${errorText}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  const parser = new SSEParser();

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const encoder = new TextEncoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }

        const chunk = decoder.decode(value, { stream: true });
        const events = parser.parse(chunk);

        for (const event of events) {
          if (event.event === "message_stop") {
            controller.close();
            return;
          }
          if (event.event === "content_block_delta") {
            try {
              const json = JSON.parse(event.data);
              const text = json.delta?.text;
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            } catch {
              // Skip unparseable chunks
            }
          }
        }
      }
    },
    cancel() {
      reader.cancel();
    },
  });
};
