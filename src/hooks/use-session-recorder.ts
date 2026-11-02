"use client";

import { useCallback, useEffect, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import type { RsvpWord } from "@/lib/rsvp";
import { supabase } from "@/lib/supabase";
import type { TablesInsert } from "@/lib/database.types";

type SessionRow = TablesInsert<"reading_sessions">;
type Pending = { userId: string; row: SessionRow };

// Sessions read offline wait here and are sent when the network is back.
const PENDING_KEY = "monkeyread-pending-sessions";

function readPending(): Pending[] {
  try {
    return JSON.parse(localStorage.getItem(PENDING_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writePending(list: Pending[]) {
  try {
    if (list.length) localStorage.setItem(PENDING_KEY, JSON.stringify(list));
    else localStorage.removeItem(PENDING_KEY);
  } catch {}
}

/** Saves a session; offline, it is queued instead of lost. Server rejections are dropped. */
async function saveSession(userId: string, row: SessionRow) {
  const { error } = await supabase.from("reading_sessions").insert(row);
  if (!error) return true;
  if (!navigator.onLine) writePending([...readPending(), { userId, row }]);
  else console.warn("reading session not saved:", error.message);
  return false;
}

let sending = false;

/** Sends this user's queued sessions in order, stopping at the first one still offline. */
async function sendPending(userId: string) {
  if (sending || !navigator.onLine) return;
  sending = true;
  try {
    for (const item of readPending().filter((p) => p.userId === userId)) {
      // Dequeue first; saveSession queues it again if the network drops meanwhile.
      const same = (p: Pending) => p.userId === userId && p.row.started_at === item.row.started_at;
      writePending(readPending().filter((p) => !same(p)));
      if (!(await saveSession(userId, item.row)) && !navigator.onLine) break;
    }
  } finally {
    sending = false;
  }
}

type Input = {
  user: User | null;
  playing: boolean;
  done: boolean;
  index: number;
  currentChunk: RsvpWord[] | undefined;
  totalWords: number;
  wpm: number;
  chunkSize: number;
  // Changing this ends the current session (new text or chunking).
  sourceKey: string;
};

type Draft = {
  startedAt: number;
  activeMs: number;
  playStart: number | null;
  words: number;
  maxWpm: number;
  chunkSize: number;
  totalWords: number;
};

// Builds one reading session per run (only time spent playing counts) and saves it when the run ends.
export function useSessionRecorder(input: Input) {
  const latest = useRef(input);
  latest.current = input;
  const draft = useRef<Draft | null>(null);

  const flush = useCallback((completed: boolean) => {
    const d = draft.current;
    draft.current = null;
    if (!d || !latest.current.user) return;
    const activeMs = d.activeMs + (d.playStart === null ? 0 : performance.now() - d.playStart);
    // Arrow skips while playing can show words faster than the speed; the DB rejects that.
    const maxWords = Math.ceil((activeMs * d.maxWpm) / 60000) + d.chunkSize;
    const words = Math.min(d.words, maxWords, d.totalWords);
    if (words < 1 || activeMs < 1000) return;
    void saveSession(latest.current.user.id, {
      started_at: new Date(d.startedAt).toISOString(),
      duration_ms: Math.round(Math.min(activeMs, 21600000)),
      words_read: words,
      total_words: d.totalWords,
      wpm: d.maxWpm,
      chunk_size: d.chunkSize,
      completed,
    });
  }, []);

  const userId = input.user?.id;
  useEffect(() => {
    if (!userId) return;
    const send = () => void sendPending(userId);
    send();
    window.addEventListener("online", send);
    return () => window.removeEventListener("online", send);
  }, [userId]);

  const { playing, done, index, wpm, sourceKey } = input;

  useEffect(() => {
    const d = draft.current;
    if (playing && document.visibilityState === "visible") {
      if (!d) {
        const { wpm, chunkSize, totalWords } = latest.current;
        draft.current = {
          startedAt: Date.now(),
          activeMs: 0,
          playStart: performance.now(),
          words: 0,
          maxWpm: wpm,
          chunkSize,
          totalWords,
        };
      } else if (d.playStart === null) {
        d.playStart = performance.now();
      }
      const chunk = latest.current.currentChunk;
      if (chunk) draft.current!.words += chunk.length;
    } else if (d && d.playStart !== null) {
      d.activeMs += performance.now() - d.playStart;
      d.playStart = null;
    }
  }, [playing, index]);

  useEffect(() => {
    if (draft.current) draft.current.maxWpm = Math.max(draft.current.maxWpm, wpm);
  }, [wpm]);

  useEffect(() => {
    if (done) flush(true);
  }, [done, flush]);

  useEffect(() => () => flush(false), [sourceKey, flush]);

  useEffect(() => {
    const onHide = () => document.visibilityState === "hidden" && flush(false);
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [flush]);

  return { endSession: () => flush(false) };
}
