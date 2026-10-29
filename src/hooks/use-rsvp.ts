"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { chunkWords, durationFactor, msPerWord, tokenize, type TimingOptions } from "@/lib/rsvp";

export type RsvpSettings = TimingOptions & {
  wpm: number;
  chunkSize: number;
};

/** `startWord` is where a new text begins, e.g. a saved position; changing it jumps there. */
export function useRsvp(text: string, settings: RsvpSettings, startWord = 0) {
  const words = useMemo(() => tokenize(text), [text]);
  const size = settings.chunkSize;
  const chunks = useMemo(() => chunkWords(words, size), [words, size]);
  const { punctuationPause, longWordLength, longWordExtra } = settings;
  const timing = useMemo(
    () => ({ punctuationPause, longWordLength, longWordExtra }),
    [punctuationPause, longWordLength, longWordExtra],
  );
  const avgFactor = useMemo(
    () => words.reduce((sum, w) => sum + durationFactor(w, timing), 0) / (words.length || 1),
    [words, timing],
  );

  // Position is kept in words, so changing the chunk size doesn't lose the place.
  const [word, setWord] = useState(0);
  const [playing, setPlaying] = useState(false);
  const index = Math.floor(word / size);

  const done = chunks.length > 0 && index >= chunks.length;

  useEffect(() => {
    if (!playing) return;
    if (index >= chunks.length) {
      setPlaying(false);
      return;
    }
    const base = msPerWord(settings.wpm);
    const duration = chunks[index].reduce((sum, w) => sum + base * durationFactor(w, timing), 0);
    const id = setTimeout(() => setWord((index + 1) * size), duration);
    return () => clearTimeout(id);
  }, [playing, index, chunks, size, settings.wpm, timing]);

  const reset = useCallback(() => {
    setPlaying(false);
    setWord(0);
  }, []);

  useEffect(() => {
    setPlaying(false);
    setWord(startWord < words.length ? startWord : 0);
  }, [words, startWord]);

  const toggle = useCallback(() => {
    if (done) {
      setWord(0);
      setPlaying(true);
      return;
    }
    setPlaying((p) => !p);
  }, [done]);

  const step = useCallback(
    (delta: number) =>
      setWord((w) => Math.max(0, Math.min(Math.floor(w / size) + delta, chunks.length - 1)) * size),
    [chunks.length, size],
  );

  return {
    currentChunk: chunks[index],
    index,
    word: Math.min(word, words.length),
    total: chunks.length,
    totalWords: words.length,
    remainingMs: Math.max(0, words.length - word) * msPerWord(settings.wpm) * avgFactor,
    playing,
    done,
    toggle,
    reset,
    step,
  };
}
