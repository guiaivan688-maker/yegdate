"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import fr from "@/locales/fr.json";
import en from "@/locales/en.json";

export type Locale = "fr" | "en";

const dictionaries = { fr, en } as const;

function resolve(obj: unknown, path: string): string | undefined {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj) as string | undefined;
}

interface LocaleContextType {
  locale: Locale;
  toggleLocale: () => void;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: "fr",
  toggleLocale: () => {},
  setLocale: () => {},
  t: (key) => key,
});

const STORAGE_KEY = "yegdate-locale";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "fr" || stored === "en") {
      // SSR-safe: hydrate from localStorage after mount to avoid a hydration mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocaleState(stored);
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => {
      const next = prev === "fr" ? "en" : "fr";
      localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next;
      return next;
    });
  }, []);

  const t = useCallback(
    (key: string): string => {
      return resolve(dictionaries[locale], key) ?? resolve(dictionaries.fr, key) ?? key;
    },
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, toggleLocale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
