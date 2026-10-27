"use client";

import { ChartLine, Database, HardDrive, Lock, Trash2, User } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { A, Doc, DocSection, REPO_URL } from "@/components/layout/doc";

export default function PrivacyPage() {
  return (
    <PageShell>
      <Doc>
        <DocSection icon={Lock} title="confidentialité">
          <p>
            monkeyread collecte le moins possible. Sans compte, rien de personnel ne quitte ton
            navigateur.
          </p>
        </DocSection>

        <DocSection icon={HardDrive} title="dans ton navigateur">
          <p>
            Tes réglages sont gardés dans le stockage local du navigateur, et tes livres avec ta
            position de lecture dans sa base IndexedDB. Ils ne sont jamais envoyés à un serveur.
            Vider les données du site les efface.
          </p>
        </DocSection>

        <DocSection icon={User} title="si tu crées un compte">
          <p>Le compte est facultatif. S&apos;il existe, sont enregistrés chez Supabase :</p>
          <ul className="grid list-disc gap-2 pl-6">
            <li>
              ton email, et si tu passes par Google, GitHub ou Discord, le nom et l&apos;avatar
              qu&apos;ils fournissent ;
            </li>
            <li>ton pseudo et les infos de profil que tu remplis, visibles publiquement ;</li>
            <li>
              tes sessions de lecture (date, durée, mots lus, vitesse), jamais le texte lu ni le
              titre du livre ;
            </li>
            <li>tes réglages, pour les retrouver sur tous tes appareils.</li>
          </ul>
          <p>
            Ta session de connexion est gardée dans le stockage local du navigateur, sans cookie.
            Tes statistiques publiques (totaux, classements, activité si tu l&apos;affiches) sont
            visibles par tous.
          </p>
        </DocSection>

        <DocSection icon={ChartLine} title="mesure d'audience">
          <p>
            Les visites sont comptées avec Vercel Analytics : anonyme, sans cookie, sans suivi
            d&apos;un site à l&apos;autre. Aucune pub, aucune donnée vendue.
          </p>
        </DocSection>

        <DocSection icon={Trash2} title="tes droits">
          <p>
            Tu peux modifier ton profil à tout moment, et supprimer ton compte depuis les paramètres
            du compte : ton profil, tes réglages et tout ton historique sont effacés immédiatement.
            Pour toute autre demande, ouvre un ticket sur <A href={`${REPO_URL}/issues`}>GitHub</A>.
          </p>
        </DocSection>

        <DocSection icon={Database} title="hébergement">
          <p>
            Le site est hébergé par Vercel, les comptes et statistiques par Supabase. Le code est
            public : tu peux vérifier tout ce qui est écrit ici.
          </p>
        </DocSection>
      </Doc>
    </PageShell>
  );
}
