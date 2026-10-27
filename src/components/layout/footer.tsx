import type { Settings } from "@/hooks/use-settings";

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="rounded bg-muted px-1.5 py-0.5 text-foreground">{children}</kbd>;
}

export function Footer({ settings }: { settings: Settings }) {
  if (!settings.showKeyTips) return null;

  return (
    <footer className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
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
    </footer>
  );
}
