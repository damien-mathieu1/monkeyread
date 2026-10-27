"use client";

import { Heart, Info, Palette, Scale } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Doc, DocSection } from "@/components/layout/doc";
import { useT } from "@/lib/i18n";

const ICONS = [Info, Heart, Palette, Scale];

export default function AboutPage() {
  const t = useT();
  return (
    <PageShell>
      <Doc>
        {t.docs.about.map((s, i) => (
          <DocSection key={s.title} icon={ICONS[i]} title={s.title}>
            {s.body}
          </DocSection>
        ))}
      </Doc>
    </PageShell>
  );
}
