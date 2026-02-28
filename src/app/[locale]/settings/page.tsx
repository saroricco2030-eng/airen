import { setRequestLocale } from "next-intl/server";
import SettingsContent from "./SettingsContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SettingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SettingsContent />;
}
