"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { chunkWords, msPerWord, tokenize, type RsvpWord } from "@/lib/rsvp";

export type RsvpSettings = {
  wpm: number;
  chunkSize: number;
};

export function useRsvp(text: string, settings: RsvpSettings) {
  const words = useMemo(() => tokenize(text), [text]);
  const chunks = useMemo(() => chunkWords(words, settings.chunkSize), [words, settings.chunkSize]);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => clear, [clear]);

  useEffect(() => {
    if (!playing) return;
    if (index >= chunks.length) {
      setPlaying(false);
      return;
    }
    const chunk = chunks[index];
    const duration = chunk.reduce((sum, w) => sum + msPerWord(settings.wpm) * w.pauseMultiplier, 0);
    timeoutRef.current = setTimeout(() => {
      setIndex((i) => i + 1);
    }, duration);
    return clear;
  }, [playing, index, chunks, settings.wpm, clear]);

  const play = useCallback(() => {
    if (index >= chunks.length) setIndex(0);
    setPlaying(true);
  }, [index, chunks.length]);

  const pause = useCallback(() => setPlaying(false), []);

  const reset = useCallback(() => {
    setPlaying(false);
    setIndex(0);
  }, []);

  const seek = useCallback(
    (i: number) => {
      setIndex(Math.max(0, Math.min(i, chunks.length)));
    },
    [chunks.length],
  );

  const currentChunk: RsvpWord[] | undefined = chunks[index];
  const progress = chunks.length === 0 ? 0 : index / chunks.length;

  return {
    chunks,
    currentChunk,
    index,
    playing,
    progress,
    play,
    pause,
    reset,
    seek,
    done: index >= chunks.length && chunks.length > 0,
  };
}
