"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) setValue(initialText);
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
        <DialogFooter>
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
