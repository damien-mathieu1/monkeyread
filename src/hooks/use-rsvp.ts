"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { chunkWords, msPerWord, tokenize } from "@/lib/rsvp";

export type RsvpSettings = {
  wpm: number;
  chunkSize: number;
  punctuationPause: boolean;
};

export function useRsvp(text: string, settings: RsvpSettings) {
  const words = useMemo(() => tokenize(text), [text]);
  const chunks = useMemo(() => chunkWords(words, settings.chunkSize), [words, settings.chunkSize]);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const playStartRef = useRef<number | null>(null);

  const done = chunks.length > 0 && index >= chunks.length;

  useEffect(() => {
    if (playing) {
      playStartRef.current = performance.now();
    } else if (playStartRef.current !== null) {
      const start = playStartRef.current;
      playStartRef.current = null;
      setElapsedMs((ms) => ms + performance.now() - start);
    }
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    if (index >= chunks.length) {
      setPlaying(false);
      return;
    }
    const base = msPerWord(settings.wpm);
    const duration = chunks[index].reduce(
      (sum, w) => sum + base * (settings.punctuationPause ? w.pauseMultiplier : 1),
      0,
    );
    const id = setTimeout(() => setIndex((i) => i + 1), duration);
    return () => clearTimeout(id);
  }, [playing, index, chunks, settings.wpm, settings.punctuationPause]);

  const reset = useCallback(() => {
    setPlaying(false);
    setIndex(0);
    setElapsedMs(0);
    playStartRef.current = null;
  }, []);

  useEffect(reset, [chunks, reset]);

  const toggle = useCallback(() => {
    if (done) {
      reset();
      setPlaying(true);
      return;
    }
    setPlaying((p) => !p);
  }, [done, reset]);

  const step = useCallback(
    (delta: number) => setIndex((i) => Math.max(0, Math.min(i + delta, chunks.length - 1))),
    [chunks.length],
  );

  const wordsRead = chunks.slice(0, index).reduce((n, c) => n + c.length, 0);

  return {
    currentChunk: chunks[index],
    index,
    total: chunks.length,
    totalWords: words.length,
    wordsRead,
    elapsedMs,
    playing,
    done,
    toggle,
    reset,
    step,
  };
}
