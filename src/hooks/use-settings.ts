"use client";

import { useCallback, useEffect, useState } from "react";
import type { ThemeId } from "@/lib/themes";
import type { FontId } from "@/lib/font-list";
import type { SoundId } from "@/lib/sound";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/auth-provider";

export type Settings = {
  wpm: number;
  chunkSize: number;
  skipSeconds: number;
  wordStep: number;
  punctuationPause: boolean;
  quickRestart: "off" | "tab" | "esc";
  highlightLetter: boolean;
  showGuides: boolean;
  progressStyle: "off" | "text" | "mini" | "bar";
  animateNumbers: boolean;
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
  skipSeconds: 10,
  wordStep: 1,
  punctuationPause: true,
  quickRestart: "tab",
  highlightLetter: true,
  showGuides: true,
  progressStyle: "text",
  animateNumbers: true,
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

let remoteTimer: ReturnType<typeof setTimeout> | undefined;
let signedIn = false;

function persist(s: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {}
  if (!signedIn) return;
  clearTimeout(remoteTimer);
  remoteTimer = setTimeout(() => {
    void supabase
      .from("user_settings")
      .upsert({ settings: s, updated_at: new Date().toISOString() })
      .then(({ error }) => error && console.warn("settings not synced:", error.message));
  }, 500);
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
    } catch {}
  }, []);

  // Account settings win on sign-in; a new account adopts the local ones.
  useEffect(() => {
    signedIn = !!userId;
    if (!userId) return;
    let cancelled = false;
    void supabase
      .from("user_settings")
      .select("settings")
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        if (!data) return setSettings((local) => (persist(local), local));
        const remote = { ...DEFAULT_SETTINGS, ...(data.settings as Partial<Settings>) };
        applyToDocument(remote);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
        } catch {}
        setSettings(remote);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

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
