"use client";

import Link from "next/link";
import { WifiOff } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

/** Shown by the service worker for pages that need the network while offline. */
export default function OfflinePage() {
  const t = useT();
  return (
    <PageShell>
      <div className="grid justify-items-center gap-4 py-24 text-center">
        <WifiOff className="size-12 text-muted-foreground" />
        <p className="text-2xl">{t.offline.title}</p>
        <p className="max-w-md text-muted-foreground">{t.offline.body}</p>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/">{t.nav.read}</Link>
          </Button>
          <Button asChild>
            <Link href="/library">{t.nav.library}</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
