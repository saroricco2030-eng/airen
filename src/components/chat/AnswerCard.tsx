"use client";

import { useTranslations } from "next-intl";
import MarkdownRenderer from "./MarkdownRenderer";

export interface ProviderResponse {
  providerId: string;
  modelId: string;
  modelDisplayName: string;
  providerName: string;
  status: "streaming" | "done" | "error";
  content: string;
  error?: string;
}

type Props = {
  response: ProviderResponse;
  selectedParagraphs: Set<string>;
  onToggleParagraph: (key: string, text: string) => void;
};

export default function AnswerCard({
  response,
  selectedParagraphs,
  onToggleParagraph,
}: Props) {
  const t = useTranslations("chat");
  const paragraphs = response.content
    .split(/\n\n+/)
    .filter((p) => p.trim().length > 0);

  const statusColor =
    response.status === "streaming"
      ? "text-primary-light"
      : response.status === "done"
        ? "text-green-400"
        : "text-red-400";

  const statusText =
    response.status === "streaming"
      ? t("streaming")
      : response.status === "done"
        ? t("done")
        : t("error");

  return (
    <div className="glass flex flex-col gap-3 rounded-2xl border border-border p-5 transition-all duration-300 hover:border-border-light">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">{response.providerName}</h3>
          <span className="rounded-md bg-surface px-2 py-0.5 text-xs text-muted">
            {response.modelDisplayName}
          </span>
        </div>
        <span className={`text-xs font-medium ${statusColor}`}>
          {statusText}
        </span>
      </div>

      {/* Content */}
      <div className="min-h-[60px]">
        {response.status === "error" ? (
          <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {response.error || t("errorMessage")}
          </div>
        ) : response.content ? (
          <div className="flex flex-col gap-1">
            {paragraphs.map((paragraph, index) => {
              const key = `${response.providerId}-${index}`;
              const isSelected = selectedParagraphs.has(key);

              return (
                <div
                  key={key}
                  onClick={() => onToggleParagraph(key, paragraph)}
                  className={`paragraph-selectable rounded-md p-2 ${
                    isSelected ? "paragraph-selected" : ""
                  }`}
                >
                  <MarkdownRenderer content={paragraph} />
                </div>
              );
            })}
            {response.status === "streaming" && (
              <span className="streaming-cursor inline-block text-sm" />
            )}
          </div>
        ) : (
          response.status === "streaming" && (
            <span className="streaming-cursor inline-block text-sm text-muted">
              {t("streaming")}
            </span>
          )
        )}
      </div>
    </div>
  );
}
