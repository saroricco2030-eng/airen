"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold">문제가 발생했습니다</h2>
            <button
              onClick={() => reset()}
              className="rounded-xl bg-primary px-6 py-2 text-white"
            >
              다시 시도
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
