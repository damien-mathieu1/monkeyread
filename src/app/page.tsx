"use client";

import { useState } from "react";
import { useRsvp } from "@/hooks/use-rsvp";
import { TextInput } from "@/components/reader/text-input";
import { WordDisplay } from "@/components/reader/word-display";
import { ReaderControls } from "@/components/reader/reader-controls";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [text, setText] = useState<string | null>(null);
  const [wpm, setWpm] = useState(250);
  const [chunkSize, setChunkSize] = useState(1);

  const rsvp = useRsvp(text ?? "", { wpm, chunkSize });

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 p-6">
      <h1 className="font-serif text-2xl tracking-tight">monkeyread.</h1>

      {text === null ? (
        <TextInput onSubmit={setText} />
      ) : (
        <div className="flex w-full max-w-xl flex-col items-center gap-10">
          <WordDisplay chunk={rsvp.currentChunk} />
          <ReaderControls
            wpm={wpm}
            onWpmChange={setWpm}
            chunkSize={chunkSize}
            onChunkSizeChange={setChunkSize}
            playing={rsvp.playing}
            onPlayPause={rsvp.playing ? rsvp.pause : rsvp.play}
            onReset={rsvp.reset}
          />
          <Button variant="ghost" size="sm" onClick={() => setText(null)}>
            nouveau texte
          </Button>
        </div>
      )}
    </main>
  );
}
