"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { setFormatLocale } from "@/lib/format";
import { fr, type Dict } from "@/lib/i18n/fr";
import { en } from "@/lib/i18n/en";

export const LANGS = [
  { id: "fr", name: "français", locale: "fr-FR" },
  { id: "en", name: "english", locale: "en-US" },
] as const;

export type Lang = (typeof LANGS)[number]["id"];

const DICTS: Record<Lang, Dict> = { fr, en };
const STORAGE_KEY = "monkeyread-lang";

function isLang(value: unknown): value is Lang {
  return LANGS.some((l) => l.id === value);
}

/** Saved choice, else the browser language (French or English). */
function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {}
  return navigator.language.slice(0, 2) === "fr" ? "fr" : "en";
}

const I18nContext = createContext<{ lang: Lang; t: Dict; setLang: (lang: Lang) => void }>({
  lang: "fr",
  t: fr,
  setLang: () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  const apply = useCallback((next: Lang) => {
    setFormatLocale(LANGS.find((l) => l.id === next)!.locale);
    document.documentElement.lang = next;
    setLangState(next);
  }, []);

  // Server render is French; switch after mount (shortcut: English visitors see a brief French
  // flash, move the choice to a cookie read on the server if that bothers anyone).
  useEffect(() => {
    apply(detectLang());
  }, [apply]);

  const setLang = useCallback(
    (next: Lang) => {
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {}
      apply(next);
    },
    [apply],
  );

  return (
    <I18nContext.Provider value={{ lang, t: DICTS[lang], setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
export const useT = () => useContext(I18nContext).t;
