"use client";

import { useCallback, useEffect, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import type { RsvpWord } from "@/lib/rsvp";
import { supabase } from "@/lib/supabase";

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
    // Query builders are lazy: the request only fires once awaited or then-ed.
    void supabase
      .from("reading_sessions")
      .insert({
        started_at: new Date(d.startedAt).toISOString(),
        duration_ms: Math.round(Math.min(activeMs, 21600000)),
        words_read: words,
        total_words: d.totalWords,
        wpm: d.maxWpm,
        chunk_size: d.chunkSize,
        completed,
      })
      .then(({ error }) => error && console.warn("reading session not saved:", error.message));
  }, []);

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
