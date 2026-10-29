"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useRsvp } from "@/hooks/use-rsvp";
import { useSettings } from "@/hooks/use-settings";
import { useSessionRecorder } from "@/hooks/use-session-recorder";
import { useAuth } from "@/components/auth/auth-provider";
import { useT } from "@/lib/i18n";
import { getBook, savePosition, type Book } from "@/lib/library";
import NumberFlow from "@number-flow/react";
import { RemainingTime } from "@/components/reader/remaining-time";
import { playSound } from "@/lib/sound";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ConfigBar } from "@/components/reader/config-bar";
import { CustomTextDialog } from "@/components/reader/custom-text-dialog";
import { WordDisplay } from "@/components/reader/word-display";

const WPM_STEP = 25;

// What the reader last showed, so leaving the page and coming back resumes it.
const LAST_KEY = "monkeyread-last";
type Last = { bookId: string } | { text: string; position: number };

function saveLast(last: Last) {
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify(last));
  } catch {}
}

function loadLast(): Partial<{ bookId: string; text: string; position: number }> {
  try {
    return JSON.parse(localStorage.getItem(LAST_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export default function Home() {
  const { settings, update } = useSettings();
  const t = useT();
  // null shows the sample text in the current language.
  const [customText, setText] = useState<string | null>(null);
  const text = customText ?? t.reader.sample;
  const [book, setBook] = useState<Book | null>(null);
  const [startWord, setStartWord] = useState(0);
  const [textDialogOpen, setTextDialogOpen] = useState(false);
  const [mouseMoved, setMouseMoved] = useState(false);
  const [runId, setRunId] = useState(0);
  const { user } = useAuth();
  const rsvp = useRsvp(text, settings, startWord);
  const { toggle, reset, step, skip, playing, index } = rsvp;
  const touched = useRef(false);

  useEffect(() => {
    const last = loadLast();
    const id = new URLSearchParams(window.location.search).get("book") ?? last.bookId;
    if (!id) {
      if (last.text) {
        setStartWord(last.position ?? 0);
        setText(last.text);
      }
      return;
    }
    void getBook(id).then((found) => {
      if (!found) return;
      touched.current = false;
      saveLast({ bookId: id });
      setStartWord(found.book.position);
      setBook(found.book);
      setText(found.text);
    });
  }, []);

  // Saves the position on pause, every 25 chunks and when leaving the page; skipped until
  // reading starts so loading a text can't overwrite its saved position.
  const save = useRef(() => {});
  save.current = () => {
    if (!touched.current) return;
    if (book) void savePosition(book.id, rsvp.word);
    else if (customText) saveLast({ text: customText, position: rsvp.word });
  };
  useEffect(() => {
    if (playing) touched.current = true;
    if (!playing || index % 25 === 0) save.current();
  }, [book, customText, playing, index, rsvp.word]);
  useEffect(() => {
    const onHide = () => save.current();
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      onHide();
    };
  }, []);

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
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
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
      } else if (e.key === "j" || e.key === "l") {
        skip(e.key === "j" ? -settings.skipSeconds : settings.skipSeconds);
      } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const delta = e.key === "ArrowUp" ? WPM_STEP : -WPM_STEP;
        update("wpm", Math.max(50, Math.min(settings.wpm + delta, 2000)));
      } else if (["1", "2", "3"].includes(e.key)) {
        update("chunkSize", Number(e.key));
      } else if (e.key === "p") {
        update("punctuationPause", !settings.punctuationPause);
      } else if (e.key === "t") {
        e.preventDefault();
        setTextDialogOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    textDialogOpen,
    toggle,
    reset,
    step,
    skip,
    update,
    settings.quickRestart,
    settings.wpm,
    settings.punctuationPause,
    settings.skipSeconds,
  ]);

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
          {book && (
            <span className={cn("truncate text-muted-foreground", focusFade)}>{book.title}</span>
          )}
          <span
            className={cn(
              "h-8 text-primary",
              settings.progressStyle === "text" && "text-2xl",
              settings.progressStyle === "mini" && "text-sm",
              (settings.progressStyle === "off" || settings.progressStyle === "bar") && "invisible",
            )}
          >
            <NumberFlow value={rsvp.index} animated={settings.animateNumbers} />/{rsvp.total}
            {!rsvp.done && (
              <span className="text-muted-foreground">
                {" "}
                ·{" "}
                {t.reader.remaining(
                  <RemainingTime ms={rsvp.remainingMs} animated={settings.animateNumbers} />,
                )}
              </span>
            )}
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
        onSave={(value) => {
          touched.current = false;
          saveLast({ text: value, position: 0 });
          setBook(null);
          setStartWord(0);
          setText(value);
          window.history.replaceState(null, "", "/");
        }}
      />
    </div>
  );
}
