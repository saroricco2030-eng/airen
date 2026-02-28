"use client";

import type { ProviderResponse } from "./AnswerCard";
import AnswerCard from "./AnswerCard";
import SkeletonCard from "./SkeletonCard";

type Props = {
  responses: ProviderResponse[];
  isLoading: boolean;
  expectedCount: number;
  selectedParagraphs: Set<string>;
  onToggleParagraph: (key: string, text: string) => void;
};

export default function AnswerGrid({
  responses,
  isLoading,
  expectedCount,
  selectedParagraphs,
  onToggleParagraph,
}: Props) {
  const skeletonCount = Math.max(0, expectedCount - responses.length);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {responses.map((response) => (
        <AnswerCard
          key={response.providerId}
          response={response}
          selectedParagraphs={selectedParagraphs}
          onToggleParagraph={onToggleParagraph}
        />
      ))}
      {isLoading &&
        Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={`skeleton-${i}`} />
        ))}
    </div>
  );
}
