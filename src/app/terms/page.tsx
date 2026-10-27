"use client";

import { BookOpen, Crown, FileText, Scale, User } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Doc, DocSection } from "@/components/layout/doc";
import { useT } from "@/lib/i18n";

const ICONS = [FileText, BookOpen, User, Crown, Scale];

export default function TermsPage() {
  const t = useT();
  return (
    <PageShell>
      <Doc>
        {t.docs.terms.map((s, i) => (
          <DocSection key={s.title} icon={ICONS[i]} title={s.title}>
            {s.body}
          </DocSection>
        ))}
      </Doc>
    </PageShell>
  );
}
