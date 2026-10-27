"use client";

import { ChartLine, Database, HardDrive, Lock, Trash2, User } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Doc, DocSection } from "@/components/layout/doc";
import { useT } from "@/lib/i18n";

const ICONS = [Lock, HardDrive, User, ChartLine, Trash2, Database];

export default function PrivacyPage() {
  const t = useT();
  return (
    <PageShell>
      <Doc>
        {t.docs.privacy.map((s, i) => (
          <DocSection key={s.title} icon={ICONS[i]} title={s.title}>
            {s.body}
          </DocSection>
        ))}
      </Doc>
    </PageShell>
  );
}
