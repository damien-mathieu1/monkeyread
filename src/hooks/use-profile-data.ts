"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase, type PublicProfile } from "@/lib/supabase";

export type ActivityDay = { day: string; words_read: number; time_ms: number; sessions: number };
export type Rank = { rank: number; total: number } | null;

export type ProfileData = {
  profile: PublicProfile;
  activity: ActivityDay[];
  wordsRank: Rank;
  timeRank: Rank;
};

async function load(name: string): Promise<ProfileData | null> {
  const [profile, activity, words, time] = await Promise.all([
    supabase.rpc("public_profile", { p_name: name }),
    supabase.rpc("activity", { p_name: name }),
    supabase.rpc("leaderboard_rank", { p_metric: "words", p_period: "all", p_name: name }),
    supabase.rpc("leaderboard_rank", { p_metric: "time", p_period: "all", p_name: name }),
  ]);
  const p = profile.data?.[0];
  if (!p) return null;
  return {
    profile: p,
    activity: activity.data ?? [],
    wordsRank: words.data?.[0] ?? null,
    timeRank: time.data?.[0] ?? null,
  };
}

export function useProfileData(name: string | undefined) {
  const [data, setData] = useState<ProfileData | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");

  const reload = useCallback(async () => {
    if (!name) return;
    const result = await load(name);
    setData(result);
    setStatus(result ? "ready" : "missing");
  }, [name]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, status, reload };
}
