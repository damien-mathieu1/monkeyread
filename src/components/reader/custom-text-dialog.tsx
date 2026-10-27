"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ACCEPTED_FILES, extractBook, extractErrorCode } from "@/lib/extract-text";
import { useT } from "@/lib/i18n";
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
  const t = useT();
  const [status, setStatus] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const importFile = async (file: File | undefined) => {
    if (!file) return;
    setStatus(t.library.importing(file.name));
    try {
      setValue((await extractBook(file)).text);
      setStatus("");
    } catch (e) {
      setStatus(t.library.errors[extractErrorCode(e)]);
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
          <DialogTitle>{t.reader.customText}</DialogTitle>
        </DialogHeader>
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t.reader.pastePlaceholder}
          className="h-72"
          autoFocus
        />
        {status && <p className="text-sm text-muted-foreground">{status}</p>}
        <DialogFooter>
          <Button onClick={() => input.current?.click()}>
            <Upload />
            {t.reader.importFile}
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
            {t.common.ok}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
