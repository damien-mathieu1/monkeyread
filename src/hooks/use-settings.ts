"use client";

import { useCallback, useEffect, useState } from "react";
import type { ThemeId } from "@/lib/themes";

export type Settings = {
  wpm: number;
  chunkSize: number;
  punctuationPause: boolean;
  theme: ThemeId;
};

const STORAGE_KEY = "monkeyread-settings";

const DEFAULTS: Settings = {
  wpm: 250,
  chunkSize: 1,
  punctuationPause: true,
  theme: "serika_dark",
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSettings({ ...DEFAULTS, ...JSON.parse(saved) });
    } catch {}
  }, []);

  const update = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    if (key === "theme") document.documentElement.dataset.theme = value as ThemeId;
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return { settings, update };
}
