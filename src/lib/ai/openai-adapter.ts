import { SSEParser } from "./sse-parser";
import type { AdapterFn } from "./types";

export const openaiAdapter: AdapterFn = async (
  modelId,
  question,
  apiKey,
  baseUrl,
  signal
) => {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages: [{ role: "user", content: question }],
      stream: true,
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
          if (event.data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(event.data);
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          } catch {
            // Skip unparseable chunks
          }
        }
      }
    },
    cancel() {
      reader.cancel();
    },
  });
};
