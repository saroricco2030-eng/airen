export interface StreamRequest {
  providerId: string;
  modelId: string;
  question: string;
  apiKey: string;
}

export type AdapterFn = (
  modelId: string,
  question: string,
  apiKey: string,
  baseUrl: string,
  signal: AbortSignal
) => Promise<ReadableStream<Uint8Array>>;
