"use client";

import { Heart, Info, Palette, Scale } from "lucide-react";
import { Header } from "@/components/layout/header";

function H2({ icon: Icon, children }: { icon: typeof Info; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 pb-2 text-4xl text-muted-foreground">
      <Icon className="size-8" />
      {children}
    </h2>
  );
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-primary underline-offset-4 hover:underline"
    >
      {children}
    </a>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-8 py-8">
      <Header />

      <main className="grid max-w-3xl flex-1 content-start gap-12 leading-relaxed">
        <section className="grid gap-4">
          <H2 icon={Info}>à propos</H2>
          <p>
            monkeyread est un lecteur rapide : les mots défilent un par un au même endroit, avec une
            lettre colorée pour poser le regard. Colle ton texte, choisis ta vitesse, et lis.
          </p>
        </section>

        <section className="grid gap-4">
          <H2 icon={Heart}>merci monkeytype</H2>
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
        </section>

        <section className="grid gap-4">
          <H2 icon={Palette}>thèmes</H2>
          <p>
            Les palettes serika dark, serika, nord et dracula reprennent les couleurs des thèmes du
            même nom dans monkeytype. Nord et dracula sont à l&apos;origine des palettes de leurs
            projets respectifs.
          </p>
        </section>

        <section className="grid gap-4">
          <H2 icon={Scale}>mentions</H2>
          <p>
            monkeyread est un projet indépendant, sans lien officiel avec monkeytype. Aucun code ni
            fichier audio de monkeytype n&apos;est réutilisé : l&apos;interface est réécrite de zéro
            et les sons sont générés dans le navigateur. Monkeytype est distribué sous licence
            GPL-3.0.
          </p>
          <p>
            Les textes que tu colles restent dans ton navigateur. Seuls partent vers un serveur tes
            statistiques de lecture et tes réglages si tu as un compte, et des visites anonymes,
            sans cookie, via Vercel Analytics.
          </p>
        </section>
      </main>
    </div>
  );
}
