"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function TextInput({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [value, setValue] = useState("");

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="colle ton texte ici..."
        className="h-64 font-serif text-lg"
      />
      <Button disabled={!value.trim()} onClick={() => onSubmit(value)}>
        lire
      </Button>
    </div>
  );
}
