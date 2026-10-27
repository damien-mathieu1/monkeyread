"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { ActivityGrid } from "@/components/account/activity-grid";
import { EditProfileDialog } from "@/components/account/edit-profile-dialog";
import { History } from "@/components/account/history";
import { BestsCard, ProfileCard, RankCard } from "@/components/account/profile-cards";
import { CenteredMessage, PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { useProfileData } from "@/hooks/use-profile-data";
import { supabase, type ReadingSession } from "@/lib/supabase";

export default function AccountPage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const { data, reload } = useProfileData(profile?.name);
  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    // shortcut: loads up to 5000 sessions client-side; paginate if heavy readers show up.
    void supabase
      .from("reading_sessions")
      .select("*")
      .order("started_at")
      .limit(5000)
      .then(({ data }) => setSessions(data ?? []));
  }, [user]);

  if (!profile || !data) {
    return (
      <PageShell>
        <CenteredMessage>chargement...</CenteredMessage>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <ProfileCard
        data={data}
        actions={
          <Button
            variant="text"
            size="sm"
            className="justify-self-start px-0"
            onClick={() => setEditOpen(true)}
          >
            <Pencil />
            modifier le profil
          </Button>
        }
      />
      <RankCard data={data} />
      <BestsCard data={data} />
      <ActivityGrid activity={data.activity} />
      <History sessions={sessions} />
      <EditProfileDialog
        profile={profile}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={() => {
          void refreshProfile();
          void reload();
        }}
      />
    </PageShell>
  );
}
