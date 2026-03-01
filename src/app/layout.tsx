import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIren — AI 집단지성 리서치 도구",
  description:
    "하나의 질문을 여러 AI에 동시에 던지고, 답변을 비교하여 최고의 결과물을 만드세요.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.svg",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
