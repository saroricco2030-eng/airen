import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("home");

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mb-8 text-lg text-muted">{t("subtitle")}</p>
        <button className="rounded-xl bg-primary px-8 py-3 font-semibold text-white transition-opacity hover:opacity-90">
          {t("cta")}
        </button>
      </div>
    </div>
  );
}
