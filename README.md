# AIren

**AI** 집단지성 리서치 도구 — 하나의 질문을 여러 AI에 동시에 보내고, 답변을 비교하여 최고의 결과물을 만드세요.

## Features

- **병렬 질문**: 등록된 모든 AI 프로바이더에 동시에 질문 전송
- **스트리밍 답변**: 실시간으로 각 AI의 응답을 카드형 UI로 비교
- **문단 조합**: 각 답변에서 원하는 문단을 선택하여 편집창에서 조합
- **다국어 지원**: 한국어 / English
- **보안**: API 키는 브라우저 localStorage에 저장, 서버 메모리에 잔류하지 않음

## Supported AI Providers

| Provider | Model |
|----------|-------|
| OpenAI | GPT-5.2, GPT-5.2 Instant |
| Anthropic | Claude Sonnet 4.5, Claude Opus 4.5 |
| Google | Gemini 3.1 Pro, Gemini 3 Flash |
| xAI | Grok 3 |
| Perplexity | Sonar Pro |
| Mistral | Mistral Large 3 |
| Groq | Llama 3.3 70B |
| Cohere | Command A |

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4, Glassmorphism
- **i18n**: next-intl
- **Error Tracking**: Sentry
- **Deploy**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone <repository-url>
cd airen
npm install
```

### Environment Variables

```bash
cp .env.example .env.local
```

`.env.example`을 참고하여 Sentry 설정을 입력하세요. AI API 키는 환경변수가 아닌 앱 내 설정 페이지에서 등록합니다.

### Development

```bash
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

### Production Build

```bash
npm run build
npm start
```

## Deploy on Vercel

1. Vercel에서 Git 저장소 연결
2. Environment Variables에 `.env.example`의 변수 추가
3. Framework Preset: **Next.js** (자동 감지)
4. Deploy

## Usage

1. `/settings` 페이지에서 사용할 AI 프로바이더의 API 키를 등록
2. 메인 화면에서 질문 입력 후 전송
3. 등록된 AI들의 답변을 카드형으로 비교
4. 원하는 문단을 클릭하여 하단 편집창에서 조합 및 복사

## License

Private
