import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Header() {
  const t = useTranslations("header");

  return (
    <header className="glass fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
      <Link href="/" className="text-xl font-bold tracking-tight">
        <span className="text-primary">AI</span>
        <span className="text-foreground">ren</span>
      </Link>
      <nav className="flex items-center gap-6">
        <Link
          href="/"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          {t("home")}
        </Link>
      </nav>
    </header>
  );
}
