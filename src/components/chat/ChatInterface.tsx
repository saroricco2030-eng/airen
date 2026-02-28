"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { AI_PROVIDERS } from "@/lib/providers";
import { hasApiKey, getApiKey } from "@/lib/apiKeyStorage";
import type { ProviderResponse } from "./AnswerCard";
import QuestionInput from "./QuestionInput";
import AnswerGrid from "./AnswerGrid";
import EditorPanel from "./EditorPanel";

export default function ChatInterface() {
  const t = useTranslations("chat");
  const [responses, setResponses] = useState<ProviderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [registeredProviders, setRegisteredProviders] = useState<string[]>([]);
  const [selectedParagraphs, setSelectedParagraphs] = useState<
    Map<string, string>
  >(new Map());
  const abortControllersRef = useRef<AbortController[]>([]);
  const responsesRef = useRef<Map<string, ProviderResponse>>(new Map());

  // Load registered providers
  useEffect(() => {
    const registered = AI_PROVIDERS.filter((p) => hasApiKey(p.id)).map(
      (p) => p.id
    );
    setRegisteredProviders(registered);
  }, []);

  const cancelAllStreams = useCallback(() => {
    abortControllersRef.current.forEach((ac) => ac.abort());
    abortControllersRef.current = [];
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => cancelAllStreams();
  }, [cancelAllStreams]);

  const handleSubmit = useCallback(
    async (question: string) => {
      // Cancel any existing streams
      cancelAllStreams();

      // Reset state
      setResponses([]);
      setSelectedParagraphs(new Map());
      setIsLoading(true);
      responsesRef.current = new Map();

      const activeProviders = AI_PROVIDERS.filter((p) =>
        registeredProviders.includes(p.id)
      );

      if (activeProviders.length === 0) return;

      // Use first model of each provider for v1
      const streamPromises = activeProviders.map(async (provider) => {
        const model = provider.models[0];
        const apiKey = getApiKey(provider.id);
        if (!apiKey) return;

        const abortController = new AbortController();
        abortControllersRef.current.push(abortController);

        const providerName =
          provider.nameKey.split(".").pop() || provider.id;

        // Initialize response
        const initialResponse: ProviderResponse = {
          providerId: provider.id,
          modelId: model.id,
          modelDisplayName: model.displayName,
          providerName:
            providerName.charAt(0).toUpperCase() + providerName.slice(1),
          status: "streaming",
          content: "",
        };

        responsesRef.current.set(provider.id, initialResponse);
        setResponses(Array.from(responsesRef.current.values()));

        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              providerId: provider.id,
              modelId: model.id,
              question,
              apiKey,
            }),
            signal: abortController.signal,
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.error || `HTTP ${response.status}`
            );
          }

          const reader = response.body!.getReader();
          const decoder = new TextDecoder();
          let accumulatedContent = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            accumulatedContent += decoder.decode(value, { stream: true });

            const updated: ProviderResponse = {
              ...initialResponse,
              content: accumulatedContent,
              status: "streaming",
            };
            responsesRef.current.set(provider.id, updated);
            setResponses(Array.from(responsesRef.current.values()));
          }

          // Mark as done
          const finalResponse: ProviderResponse = {
            ...initialResponse,
            content: accumulatedContent,
            status: "done",
          };
          responsesRef.current.set(provider.id, finalResponse);
          setResponses(Array.from(responsesRef.current.values()));
        } catch (error) {
          if ((error as Error).name === "AbortError") return;

          const errorResponse: ProviderResponse = {
            ...initialResponse,
            status: "error",
            error: (error as Error).message,
          };
          responsesRef.current.set(provider.id, errorResponse);
          setResponses(Array.from(responsesRef.current.values()));
        }
      });

      await Promise.allSettled(streamPromises);
      setIsLoading(false);
    },
    [registeredProviders, cancelAllStreams]
  );

  const handleToggleParagraph = useCallback(
    (key: string, text: string) => {
      setSelectedParagraphs((prev) => {
        const next = new Map(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.set(key, text);
        }
        return next;
      });
    },
    []
  );

  const handleClearEditor = useCallback(() => {
    setSelectedParagraphs(new Map());
  }, []);

  const hasResponses = responses.length > 0;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
      <QuestionInput
        onSubmit={handleSubmit}
        isLoading={isLoading}
        registeredCount={registeredProviders.length}
      />

      {!hasResponses && !isLoading && registeredProviders.length > 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          {/* Chat bubble icon */}
          <svg
            className="mb-4 h-16 w-16 text-muted/20"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
          <p className="text-muted">{t("askQuestion")}</p>
        </div>
      )}

      {(hasResponses || isLoading) && (
        <>
          <AnswerGrid
            responses={responses}
            isLoading={isLoading}
            expectedCount={registeredProviders.length}
            selectedParagraphs={
              new Set(selectedParagraphs.keys())
            }
            onToggleParagraph={handleToggleParagraph}
          />

          {hasResponses && (
            <p className="text-center text-xs text-muted">
              {t("selectParagraphs")}
            </p>
          )}

          <EditorPanel
            selectedTexts={selectedParagraphs}
            onClear={handleClearEditor}
          />
        </>
      )}
    </div>
  );
}
