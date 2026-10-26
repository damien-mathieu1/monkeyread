"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

  const done = chunks.length > 0 && index >= chunks.length;

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
  }, []);

  useEffect(reset, [chunks, reset]);

  const toggle = useCallback(() => {
    if (done) {
      setIndex(0);
      setPlaying(true);
      return;
    }
    setPlaying((p) => !p);
  }, [done]);

  const step = useCallback(
    (delta: number) => setIndex((i) => Math.max(0, Math.min(i + delta, chunks.length - 1))),
    [chunks.length],
  );

  return {
    currentChunk: chunks[index],
    index,
    total: chunks.length,
    playing,
    done,
    toggle,
    reset,
    step,
  };
}
