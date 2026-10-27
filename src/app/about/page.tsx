"use client";

import { Heart, Info, Palette, Scale } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { A, Doc, DocSection } from "@/components/layout/doc";

export default function AboutPage() {
  return (
    <PageShell>
      <Doc>
        <DocSection icon={Info} title="à propos">
          <p>
            monkeyread est un lecteur rapide : les mots défilent un par un au même endroit, avec une
            lettre colorée pour poser le regard. Colle ton texte ou importe un livre, choisis ta
            vitesse, et lis.
          </p>
        </DocSection>

        <DocSection icon={Heart} title="merci monkeytype">
          <p>
            Toute l&apos;expérience de monkeyread vient de{" "}
            <A href="https://monkeytype.com">monkeytype</A>, le site de dactylographie minimaliste
            créé par Miodec et sa communauté. La mise en page, la barre de configuration, le mode
            focus, les modales, les animations, la page de réglages et l&apos;idée des thèmes en
            sont directement inspirés.
          </p>
          <p>
            Si tu aimes monkeyread, va taper sur monkeytype, et soutiens le projet sur{" "}
            <A href="https://github.com/monkeytypegame/monkeytype">GitHub</A>.
          </p>
        </DocSection>

        <DocSection icon={Palette} title="thèmes">
          <p>
            Les palettes serika dark, serika, nord et dracula reprennent les couleurs des thèmes du
            même nom dans monkeytype. Nord et dracula sont à l&apos;origine des palettes de leurs
            projets respectifs.
          </p>
        </DocSection>

        <DocSection icon={Scale} title="mentions">
          <p>
            monkeyread est un projet indépendant, sans lien officiel avec monkeytype. Aucun code ni
            fichier audio de monkeytype n&apos;est réutilisé : l&apos;interface est réécrite de zéro
            et les sons sont générés dans le navigateur. Monkeytype est distribué sous licence
            GPL-3.0.
          </p>
          <p>
            Les textes et livres que tu importes restent dans ton navigateur. Seuls partent vers un
            serveur tes statistiques de lecture et tes réglages si tu as un compte, et des visites
            anonymes, sans cookie, via Vercel Analytics.
          </p>
        </DocSection>
      </Doc>
    </PageShell>
  );
}
