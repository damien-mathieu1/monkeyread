"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ACCEPTED_FILES, extractBook } from "@/lib/extract-text";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialText: string;
  onSave: (text: string) => void;
};

export function CustomTextDialog({ open, onOpenChange, initialText, onSave }: Props) {
  const [value, setValue] = useState(initialText);
  const [status, setStatus] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const importFile = async (file: File | undefined) => {
    if (!file) return;
    setStatus(`import de ${file.name}...`);
    try {
      setValue((await extractBook(file)).text);
      setStatus("");
    } catch (e) {
      setStatus((e as Error).message);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setValue(initialText);
          setStatus("");
        }
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>texte personnalisé</DialogTitle>
        </DialogHeader>
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="colle ton texte ici..."
          className="h-72"
          autoFocus
        />
        {status && <p className="text-sm text-muted-foreground">{status}</p>}
        <DialogFooter>
          <Button onClick={() => input.current?.click()}>
            <Upload />
            importer un fichier
          </Button>
          <input
            ref={input}
            type="file"
            accept={ACCEPTED_FILES}
            hidden
            onChange={(e) => {
              void importFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <Button
            disabled={!value.trim()}
            onClick={() => {
              onSave(value);
              onOpenChange(false);
            }}
          >
            ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
