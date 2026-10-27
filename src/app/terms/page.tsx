"use client";

import { BookOpen, Crown, FileText, Scale, User } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { A, Doc, DocSection, REPO_URL } from "@/components/layout/doc";

export default function TermsPage() {
  return (
    <PageShell>
      <Doc>
        <DocSection icon={FileText} title="conditions d'utilisation">
          <p>
            En utilisant monkeyread, tu acceptes ces conditions. Elles sont courtes : le site est
            gratuit, sans pub, et fourni tel quel.
          </p>
        </DocSection>

        <DocSection icon={BookOpen} title="tes textes et tes livres">
          <p>
            Tu peux lire n&apos;importe quel texte que tu as le droit d&apos;utiliser : le tien, un
            livre que tu possèdes pour ton usage personnel, ou une œuvre du domaine public. Les
            fichiers importés restent dans ton navigateur et ne sont jamais envoyés ni partagés par
            monkeyread. Tu restes responsable de ce que tu importes.
          </p>
        </DocSection>

        <DocSection icon={User} title="compte">
          <p>
            Le compte est facultatif. Ton pseudo et ta bio sont publics : pas d&apos;insulte, pas
            d&apos;usurpation d&apos;identité, pas de contenu illégal. Tu peux supprimer ton compte
            et toutes ses données à tout moment depuis les paramètres du compte.
          </p>
        </DocSection>

        <DocSection icon={Crown} title="classements">
          <p>
            Les classements comptent les mots réellement affichés. Gonfler ses statistiques avec un
            script, en laissant tourner la lecture sans lire, ou en envoyant de fausses sessions
            n&apos;est pas autorisé. Les sessions et comptes concernés peuvent être retirés sans
            préavis.
          </p>
        </DocSection>

        <DocSection icon={Scale} title="garantie et licence">
          <p>
            monkeyread est fourni sans garantie : le service peut changer, s&apos;interrompre ou
            perdre des données. Le code source est libre, sous licence MIT, sur{" "}
            <A href={REPO_URL}>GitHub</A>. Ces conditions peuvent évoluer ; la version en ligne est
            celle qui s&apos;applique.
          </p>
        </DocSection>
      </Doc>
    </PageShell>
  );
}
