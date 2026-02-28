"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import type { AIProvider } from "@/lib/providers";
import { saveApiKey, getApiKey, deleteApiKey } from "@/lib/apiKeyStorage";

type Props = {
  provider: AIProvider;
  isRegistered: boolean;
  onRegistered: (id: string) => void;
  onUnregistered: (id: string) => void;
};

export default function ProviderCard({
  provider,
  isRegistered,
  onRegistered,
  onUnregistered,
}: Props) {
  const t = useTranslations("settings");
  const providerName = useTranslations()(provider.nameKey);
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const stored = getApiKey(provider.id);
    if (stored) {
      setApiKey(stored);
    }
  }, [provider.id]);

  const handleSave = () => {
    if (!apiKey.trim()) return;
    saveApiKey(provider.id, apiKey.trim());
    onRegistered(provider.id);
    setIsEditing(false);
    setShowKey(false);
  };

  const handleDelete = () => {
    deleteApiKey(provider.id);
    setApiKey("");
    setShowKey(false);
    setIsEditing(false);
    onUnregistered(provider.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
  };

  const activeClasses = isRegistered
    ? "border-primary/50 shadow-[0_0_15px_rgba(124,58,237,0.3)]"
    : "border-border opacity-60";

  return (
    <div
      className={`glass relative flex flex-col gap-4 rounded-2xl border p-5 transition-all duration-300 ${activeClasses}`}
    >
      {/* Lock overlay for unregistered */}
      {!isRegistered && !isEditing && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl">
          <svg
            className="h-8 w-8 text-muted/40"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{providerName}</h3>
        {isRegistered && (
          <span className="flex h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]" />
        )}
      </div>

      {/* Models */}
      <div className="flex flex-wrap gap-1.5">
        {provider.models.map((model) => (
          <span
            key={model.id}
            className="rounded-md bg-surface px-2 py-0.5 text-xs text-muted"
          >
            {model.displayName}
          </span>
        ))}
      </div>

      {/* API Key Input */}
      <div className="relative">
        <input
          type={showKey ? "text" : "password"}
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
            if (!isEditing) setIsEditing(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={t("apiKeyInput", { provider: providerName })}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted/50 focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-foreground"
          aria-label={showKey ? t("hideKey") : t("showKey")}
        >
          {showKey ? (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {(!isRegistered || isEditing) && (
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {t("save")}
          </button>
        )}
        {isRegistered && (
          <button
            onClick={handleDelete}
            className="flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted transition-colors hover:border-red-500/50 hover:text-red-400"
          >
            {t("delete")}
          </button>
        )}
      </div>
    </div>
  );
}
