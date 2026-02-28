"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

type Props = {
  selectedTexts: Map<string, string>;
  onClear: () => void;
};

export default function EditorPanel({ selectedTexts, onClear }: Props) {
  const t = useTranslations("chat");
  const [editedContent, setEditedContent] = useState("");
  const [copied, setCopied] = useState(false);

  // Sync selected texts to editor content
  useEffect(() => {
    const combined = Array.from(selectedTexts.values()).join("\n\n");
    setEditedContent(combined);
  }, [selectedTexts]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select the textarea content
    }
  };

  if (selectedTexts.size === 0) return null;

  return (
    <div className="slide-up glass mt-6 flex flex-col gap-3 rounded-2xl border border-primary/30 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-primary-light">
          {t("editorTitle")}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-primary/50 hover:text-foreground"
          >
            {copied ? (
              <>
                {/* Check icon */}
                <svg
                  className="h-3.5 w-3.5 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
                {t("copied")}
              </>
            ) : (
              <>
                {/* Copy icon */}
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                  />
                </svg>
                {t("copy")}
              </>
            )}
          </button>
          <button
            onClick={onClear}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-red-500/50 hover:text-red-400"
          >
            {t("clear")}
          </button>
        </div>
      </div>

      {/* Editable textarea */}
      <textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        placeholder={t("editorPlaceholder")}
        rows={6}
        className="w-full resize-y rounded-lg border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted/50 focus:border-primary focus:outline-none"
      />
    </div>
  );
}
