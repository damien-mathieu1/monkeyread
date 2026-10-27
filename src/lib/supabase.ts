import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Accounts are optional: without Supabase env vars the reader still works and account UI hides.
export const accountsEnabled = Boolean(url && key);

export const supabase = createClient<Database>(
  url || "http://localhost:54321",
  key || "accounts-disabled",
  { auth: { flowType: "pkce" } },
);

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ReadingSession = Database["public"]["Tables"]["reading_sessions"]["Row"];
export type PublicProfile = Database["public"]["Functions"]["public_profile"]["Returns"][number];
export type LeaderboardRow = Database["public"]["Functions"]["leaderboard"]["Returns"][number];
