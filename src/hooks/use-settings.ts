"use client";

import { useCallback, useEffect, useState } from "react";
import type { ThemeId } from "@/lib/themes";
import type { FontId } from "@/lib/font-list";
import type { SoundId } from "@/lib/sound";

export type Settings = {
  wpm: number;
  chunkSize: number;
  punctuationPause: boolean;
  quickRestart: "off" | "tab" | "esc";
  highlightLetter: boolean;
  showGuides: boolean;
  progressStyle: "off" | "text" | "mini" | "bar";
  sound: SoundId;
  soundVolume: number;
  fontFamily: FontId;
  fontSize: number;
  theme: ThemeId;
  showKeyTips: boolean;
};

const STORAGE_KEY = "monkeyread-settings";

export const DEFAULT_SETTINGS: Settings = {
  wpm: 250,
  chunkSize: 1,
  punctuationPause: true,
  quickRestart: "tab",
  highlightLetter: true,
  showGuides: true,
  progressStyle: "text",
  sound: "off",
  soundVolume: 0.5,
  fontFamily: "roboto-mono",
  fontSize: 2,
  theme: "serika_dark",
  showKeyTips: true,
};

export type UpdateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => void;

function applyToDocument(s: Pick<Settings, "theme" | "fontFamily">) {
  document.documentElement.dataset.theme = s.theme;
  document.documentElement.dataset.font = s.fontFamily;
}

function persist(s: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {}
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
    } catch {}
  }, []);

  const update: UpdateSetting = useCallback((key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      applyToDocument(next);
      persist(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    applyToDocument(DEFAULT_SETTINGS);
    persist(DEFAULT_SETTINGS);
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return { settings, update, resetAll };
}
