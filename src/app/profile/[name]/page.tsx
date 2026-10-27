"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { ActivityGrid } from "@/components/account/activity-grid";
import { BestsCard, ProfileCard, RankCard } from "@/components/account/profile-cards";
import { CenteredMessage, PageShell } from "@/components/layout/page-shell";
import { useProfileData } from "@/hooks/use-profile-data";

function Profile() {
  const name = decodeURIComponent(useParams<{ name: string }>().name);
  const { data, status } = useProfileData(name);

  if (status === "loading") return <CenteredMessage>chargement...</CenteredMessage>;
  if (!data) return <CenteredMessage>aucun lecteur ne s&apos;appelle « {name} »</CenteredMessage>;
  return (
    <>
      <ProfileCard data={data} />
      <RankCard data={data} />
      <BestsCard data={data} />
      {data.profile.show_activity && <ActivityGrid activity={data.activity} />}
    </>
  );
}

export default function PublicProfilePage() {
  return (
    <PageShell>
      <Suspense fallback={<CenteredMessage>chargement...</CenteredMessage>}>
        <Profile />
      </Suspense>
    </PageShell>
  );
}
