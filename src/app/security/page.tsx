"use client";

import { Bug, Clock, Shield, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { A, Doc, DocSection, REPO_URL } from "@/components/layout/doc";

export default function SecurityPage() {
  return (
    <PageShell>
      <Doc>
        <DocSection icon={Shield} title="sécurité">
          <p>
            Tu as trouvé une faille ? Merci de la signaler en privé avant d&apos;en parler
            publiquement, pour qu&apos;elle soit corrigée avant d&apos;être exploitée.
          </p>
        </DocSection>

        <DocSection icon={Bug} title="signaler une faille">
          <p>
            Ouvre un signalement privé depuis l&apos;onglet sécurité du dépôt :{" "}
            <A href={`${REPO_URL}/security/advisories/new`}>signaler une vulnérabilité</A>. Décris
            le problème, comment le reproduire et son impact. N&apos;ouvre pas de ticket public pour
            une faille.
          </p>
        </DocSection>

        <DocSection icon={ShieldCheck} title="règles">
          <ul className="grid list-disc gap-2 pl-6">
            <li>Teste uniquement avec ton propre compte, jamais avec les données des autres.</li>
            <li>Pas de déni de service, de spam ni de test automatisé massif.</li>
            <li>Ne garde ni ne partage aucune donnée obtenue pendant tes tests.</li>
          </ul>
        </DocSection>

        <DocSection icon={Clock} title="suite">
          <p>
            Tu reçois une réponse dès que possible. monkeyread est un projet bénévole, sans
            programme de récompense, mais chaque signalement corrigé est crédité si tu le souhaites.
          </p>
        </DocSection>
      </Doc>
    </PageShell>
  );
}
