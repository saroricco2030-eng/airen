"use client";

import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { Link } from "@/i18n/navigation";

type Props = {
  onSubmit: (question: string) => void;
  isLoading: boolean;
  registeredCount: number;
};

export default function QuestionInput({
  onSubmit,
  isLoading,
  registeredCount,
}: Props) {
  const t = useTranslations("chat");
  const [question, setQuestion] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  };

  if (registeredCount === 0) {
    return (
      <div className="glass flex flex-col items-center gap-4 rounded-2xl border border-border p-8 text-center">
        {/* Lock icon */}
        <svg
          className="h-12 w-12 text-muted/40"
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
        <div>
          <p className="text-lg font-semibold">{t("noProviders")}</p>
          <p className="mt-1 text-sm text-muted">
            {t("noProvidersDescription")}
          </p>
        </div>
        <Link
          href="/settings"
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {t("goToSettings")}
        </Link>
      </div>
    );
  }

  return (
    <div className="glass flex flex-col gap-3 rounded-2xl border border-border p-4">
      <div className="flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={question}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={t("inputPlaceholder")}
          rows={1}
          className="flex-1 resize-none rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-primary focus:outline-none"
          style={{ minHeight: "44px" }}
        />
        <button
          onClick={handleSubmit}
          disabled={!question.trim() || isLoading}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {isLoading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              {t("sending")}
            </>
          ) : (
            <>
              {/* Send icon */}
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
              {t("send")}
            </>
          )}
        </button>
      </div>
      <div className="flex items-center gap-2 px-1">
        <span className="flex h-2 w-2 rounded-full bg-green-400 shadow-[0_0_4px_rgba(74,222,128,0.5)]" />
        <span className="text-xs text-muted">
          {t("registeredCount", { count: registeredCount })}
        </span>
      </div>
    </div>
  );
}
