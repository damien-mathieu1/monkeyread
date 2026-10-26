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
import type { Settings, UpdateSetting } from "@/hooks/use-settings";

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="rounded bg-muted px-1.5 py-0.5 text-foreground">{children}</kbd>;
}

type Props = {
  settings: Settings;
  update: UpdateSetting;
  keyTips?: boolean;
};

export function Footer({ settings, update, keyTips }: Props) {
  const current = THEMES.find((t) => t.id === settings.theme);

  return (
    <footer className="flex flex-col gap-8 text-xs text-muted-foreground">
      {keyTips && settings.showKeyTips && (
        <div className="flex flex-col items-center gap-2">
          {settings.quickRestart !== "off" && (
            <div>
              <Kbd>{settings.quickRestart}</Kbd> - recommencer
            </div>
          )}
          <div>
            <Kbd>espace</Kbd> - lecture / pause
          </div>
          <div>
            <Kbd>←</Kbd> <Kbd>→</Kbd> - mot précédent / suivant
          </div>
        </div>
      )}

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
              value={settings.theme}
              onValueChange={(value) => update("theme", value as ThemeId)}
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
