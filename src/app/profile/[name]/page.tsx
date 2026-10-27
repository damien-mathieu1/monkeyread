"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { ActivityGrid } from "@/components/account/activity-grid";
import { BestsCard, ProfileCard, RankCard } from "@/components/account/profile-cards";
import { CenteredMessage, PageShell } from "@/components/layout/page-shell";
import { useProfileData } from "@/hooks/use-profile-data";
import { useT } from "@/lib/i18n";

function Profile() {
  const name = decodeURIComponent(useParams<{ name: string }>().name);
  const { data, status } = useProfileData(name);
  const t = useT();

  if (status === "loading") return <CenteredMessage>{t.common.loading}</CenteredMessage>;
  if (!data) return <CenteredMessage>{t.profile.notFound(name)}</CenteredMessage>;
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
  const t = useT();
  return (
    <PageShell>
      <Suspense fallback={<CenteredMessage>{t.common.loading}</CenteredMessage>}>
        <Profile />
      </Suspense>
    </PageShell>
  );
}
