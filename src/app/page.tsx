"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRsvp } from "@/hooks/use-rsvp";
import { useSettings } from "@/hooks/use-settings";
import { SAMPLE_TEXT } from "@/lib/rsvp";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ConfigBar } from "@/components/reader/config-bar";
import { CustomTextDialog } from "@/components/reader/custom-text-dialog";
import { WordDisplay } from "@/components/reader/word-display";
import { Result } from "@/components/reader/result";

export default function Home() {
  const { settings, update } = useSettings();
  const [text, setText] = useState(SAMPLE_TEXT);
  const [textDialogOpen, setTextDialogOpen] = useState(false);
  const rsvp = useRsvp(text, settings);
  const { toggle, reset, step } = rsvp;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        textDialogOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === " ") {
        e.preventDefault();
        toggle();
      } else if (e.key === "Tab") {
        e.preventDefault();
        reset();
      } else if (e.key === "ArrowLeft") {
        step(e.shiftKey ? -10 : -1);
      } else if (e.key === "ArrowRight") {
        step(e.shiftKey ? 10 : 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [textDialogOpen, toggle, reset, step]);

  const focusFade = cn(
    "transition-opacity duration-150",
    rsvp.playing && "pointer-events-none opacity-0",
  );

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-8 py-8">
      <div className={focusFade}>
        <Header />
      </div>

      <main className="flex flex-1 flex-col items-center justify-center gap-8">
        {rsvp.done ? (
          <Result
            wordsRead={rsvp.wordsRead}
            elapsedMs={rsvp.elapsedMs}
            targetWpm={settings.wpm}
            onRestart={reset}
          />
        ) : (
          <>
            <div className={focusFade}>
              <ConfigBar
                settings={settings}
                update={update}
                onCustomText={() => setTextDialogOpen(true)}
              />
            </div>
            <div className="flex w-full max-w-4xl flex-col gap-4">
              <span className="text-2xl text-primary">
                {rsvp.index}/{rsvp.total}
              </span>
              <WordDisplay chunk={rsvp.currentChunk} />
            </div>
          </>
        )}
      </main>

      <div className={focusFade}>
        <Footer theme={settings.theme} onThemeChange={(t) => update("theme", t)} />
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
