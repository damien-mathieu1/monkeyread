"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRsvp } from "@/hooks/use-rsvp";
import { useSettings } from "@/hooks/use-settings";
import { useSessionRecorder } from "@/hooks/use-session-recorder";
import { useAuth } from "@/components/auth/auth-provider";
import { SAMPLE_TEXT } from "@/lib/rsvp";
import { playSound } from "@/lib/sound";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ConfigBar } from "@/components/reader/config-bar";
import { CustomTextDialog } from "@/components/reader/custom-text-dialog";
import { WordDisplay } from "@/components/reader/word-display";

export default function Home() {
  const { settings, update } = useSettings();
  const [text, setText] = useState(SAMPLE_TEXT);
  const [textDialogOpen, setTextDialogOpen] = useState(false);
  const [mouseMoved, setMouseMoved] = useState(false);
  const [runId, setRunId] = useState(0);
  const { user } = useAuth();
  const rsvp = useRsvp(text, settings);
  const { toggle, reset, step, playing, index } = rsvp;

  useSessionRecorder({
    user,
    playing,
    done: rsvp.done,
    index,
    currentChunk: rsvp.currentChunk,
    totalWords: rsvp.totalWords,
    wpm: settings.wpm,
    chunkSize: settings.chunkSize,
    sourceKey: `${runId}|${settings.chunkSize}|${text}`,
  });

  const focused = playing && !mouseMoved;

  useEffect(() => {
    if (playing) playSound(settings.sound, settings.soundVolume);
  }, [playing, index, settings.sound, settings.soundVolume]);

  useEffect(() => {
    if (!focused) return;
    const onMove = () => setMouseMoved(true);
    window.addEventListener("mousemove", onMove, { once: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [focused]);

  useEffect(() => {
    const restart = () => {
      reset();
      setRunId((n) => n + 1);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        textDialogOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === " ") {
        e.preventDefault();
        setMouseMoved(false);
        toggle();
      } else if (
        (e.key === "Tab" && settings.quickRestart === "tab") ||
        (e.key === "Escape" && settings.quickRestart === "esc")
      ) {
        e.preventDefault();
        restart();
      } else if (e.key === "ArrowLeft") {
        step(e.shiftKey ? -10 : -1);
      } else if (e.key === "ArrowRight") {
        step(e.shiftKey ? 10 : 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [textDialogOpen, toggle, reset, step, settings.quickRestart]);

  const focusFade = cn(
    "transition-opacity duration-125",
    focused && "pointer-events-none opacity-0",
  );
  const progress = rsvp.total ? rsvp.index / rsvp.total : 0;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-8 py-8">
      {settings.progressStyle === "bar" && (
        <div
          className="fixed top-0 left-0 h-1 bg-primary transition-all duration-125"
          style={{ width: `${progress * 100}%` }}
        />
      )}

      <div className={focusFade}>
        <Header />
      </div>

      <main className="flex flex-1 flex-col items-center justify-center gap-8">
        <div className={focusFade}>
          <ConfigBar
            settings={settings}
            update={update}
            onCustomText={() => setTextDialogOpen(true)}
          />
        </div>
        <div
          key={runId}
          className="flex w-full max-w-4xl animate-in flex-col gap-4 duration-125 fade-in"
        >
          <span
            className={cn(
              "h-8 text-primary",
              settings.progressStyle === "text" && "text-2xl",
              settings.progressStyle === "mini" && "text-sm",
              (settings.progressStyle === "off" || settings.progressStyle === "bar") && "invisible",
            )}
          >
            {rsvp.index}/{rsvp.total}
          </span>
          <WordDisplay
            chunk={rsvp.currentChunk}
            ended={rsvp.done}
            highlight={settings.highlightLetter}
            guides={settings.showGuides}
            fontSize={settings.fontSize}
          />
        </div>
      </main>

      <div className={focusFade}>
        <Footer settings={settings} />
      </div>

      <CustomTextDialog
        open={textDialogOpen}
        onOpenChange={setTextDialogOpen}
        initialText={text}
        onSave={setText}
      />
    </div>
  );
}
