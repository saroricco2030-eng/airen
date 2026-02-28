import type { AdapterFn } from "./types";
import { openaiAdapter } from "./openai-adapter";
import { anthropicAdapter } from "./anthropic-adapter";
import { googleAdapter } from "./google-adapter";
import { cohereAdapter } from "./cohere-adapter";

const adapterMap: Record<string, AdapterFn> = {
  "openai-compatible": openaiAdapter,
  anthropic: anthropicAdapter,
  google: googleAdapter,
  cohere: cohereAdapter,
};

export function getAdapter(
  apiType: string
): AdapterFn {
  const adapter = adapterMap[apiType];
  if (!adapter) {
    throw new Error(`Unknown API type: ${apiType}`);
  }
  return adapter;
}
