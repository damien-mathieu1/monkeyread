"use client";

import { Bug, Clock, Shield, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Doc, DocSection } from "@/components/layout/doc";
import { useT } from "@/lib/i18n";

const ICONS = [Shield, Bug, ShieldCheck, Clock];

export default function SecurityPage() {
  const t = useT();
  return (
    <PageShell>
      <Doc>
        {t.docs.security.map((s, i) => (
          <DocSection key={s.title} icon={ICONS[i]} title={s.title}>
            {s.body}
          </DocSection>
        ))}
      </Doc>
    </PageShell>
  );
}
