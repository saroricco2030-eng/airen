"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { AI_PROVIDERS } from "@/lib/providers";
import { hasApiKey } from "@/lib/apiKeyStorage";
import ProviderCard from "./ProviderCard";

export default function SettingsContent() {
  const t = useTranslations("settings");
  const [registeredProviders, setRegisteredProviders] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const registered = new Set<string>();
    for (const provider of AI_PROVIDERS) {
      if (hasApiKey(provider.id)) {
        registered.add(provider.id);
      }
    }
    setRegisteredProviders(registered);
  }, []);

  const handleRegistered = (providerId: string) => {
    setRegisteredProviders((prev) => new Set([...prev, providerId]));
  };

  const handleUnregistered = (providerId: string) => {
    setRegisteredProviders((prev) => {
      const next = new Set(prev);
      next.delete(providerId);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-10">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          {t("title")}
        </h1>
        <p className="text-muted">{t("description")}</p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {AI_PROVIDERS.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            isRegistered={registeredProviders.has(provider.id)}
            onRegistered={handleRegistered}
            onUnregistered={handleUnregistered}
          />
        ))}
      </div>
    </div>
  );
}
