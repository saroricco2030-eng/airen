export interface AIModel {
  id: string;
  displayName: string;
}

export interface AIProvider {
  id: string;
  nameKey: string;
  models: AIModel[];
  placeholder: string;
  apiType: "openai-compatible" | "anthropic" | "google" | "cohere";
  baseUrl: string;
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: "openai",
    nameKey: "settings.providers.openai",
    models: [
      { id: "gpt-5.2", displayName: "GPT-5.2" },
      { id: "gpt-5.2-instant", displayName: "GPT-5.2 Instant" },
    ],
    placeholder: "sk-...",
    apiType: "openai-compatible",
    baseUrl: "https://api.openai.com/v1",
  },
  {
    id: "anthropic",
    nameKey: "settings.providers.anthropic",
    models: [
      { id: "claude-sonnet-4-5", displayName: "Claude Sonnet 4.5" },
      { id: "claude-opus-4-5", displayName: "Claude Opus 4.5" },
    ],
    placeholder: "sk-ant-...",
    apiType: "anthropic",
    baseUrl: "https://api.anthropic.com",
  },
  {
    id: "google",
    nameKey: "settings.providers.google",
    models: [
      { id: "gemini-3.1-pro-preview", displayName: "Gemini 3.1 Pro" },
      { id: "gemini-3-flash", displayName: "Gemini 3 Flash" },
    ],
    placeholder: "AIza...",
    apiType: "google",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
  },
  {
    id: "xai",
    nameKey: "settings.providers.xai",
    models: [{ id: "grok-3", displayName: "Grok 3" }],
    placeholder: "xai-...",
    apiType: "openai-compatible",
    baseUrl: "https://api.x.ai/v1",
  },
  {
    id: "perplexity",
    nameKey: "settings.providers.perplexity",
    models: [{ id: "sonar-pro", displayName: "Sonar Pro" }],
    placeholder: "pplx-...",
    apiType: "openai-compatible",
    baseUrl: "https://api.perplexity.ai",
  },
  {
    id: "mistral",
    nameKey: "settings.providers.mistral",
    models: [{ id: "mistral-large-latest", displayName: "Mistral Large 3" }],
    placeholder: "mk-...",
    apiType: "openai-compatible",
    baseUrl: "https://api.mistral.ai/v1",
  },
  {
    id: "groq",
    nameKey: "settings.providers.groq",
    models: [{ id: "llama-3.3-70b-versatile", displayName: "Llama 3.3 70B" }],
    placeholder: "gsk_...",
    apiType: "openai-compatible",
    baseUrl: "https://api.groq.com/openai/v1",
  },
  {
    id: "cohere",
    nameKey: "settings.providers.cohere",
    models: [{ id: "command-a-03-2025", displayName: "Command A" }],
    placeholder: "co-...",
    apiType: "cohere",
    baseUrl: "https://api.cohere.com/v2",
  },
];
