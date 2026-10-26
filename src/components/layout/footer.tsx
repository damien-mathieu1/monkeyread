"use client";

import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { THEMES, type ThemeId } from "@/lib/themes";

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="rounded bg-muted px-1.5 py-0.5 text-foreground">{children}</kbd>;
}

type Props = {
  theme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
};

export function Footer({ theme, onThemeChange }: Props) {
  const current = THEMES.find((t) => t.id === theme);

  return (
    <footer className="flex flex-col gap-8 text-xs text-muted-foreground">
      <div className="flex flex-col items-center gap-2">
        <div>
          <Kbd>tab</Kbd> - recommencer
        </div>
        <div>
          <Kbd>espace</Kbd> - lecture / pause
        </div>
        <div>
          <Kbd>←</Kbd> <Kbd>→</Kbd> - mot précédent / suivant
        </div>
      </div>

      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="text" size="sm">
              <Palette />
              {current?.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={theme}
              onValueChange={(value) => onThemeChange(value as ThemeId)}
            >
              {THEMES.map((t) => (
                <DropdownMenuRadioItem key={t.id} value={t.id}>
                  {t.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </footer>
  );
}
