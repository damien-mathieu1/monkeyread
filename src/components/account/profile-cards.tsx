import { AtSign, Code, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/account/avatar";
import type { ProfileData, Rank } from "@/hooks/use-profile-data";
import { formatDate, formatDuration, formatNumber, formatRank } from "@/lib/format";

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg bg-muted p-6">{children}</div>;
}

function Divider() {
  return <div className="hidden w-1 self-stretch rounded-full bg-background md:block" />;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-3xl">{value}</span>
    </div>
  );
}

export function ProfileCard({ data, actions }: { data: ProfileData; actions?: React.ReactNode }) {
  const p = data.profile;
  const links = [
    p.github && { href: `https://github.com/${p.github}`, icon: Code, label: "github" },
    p.twitter && { href: `https://x.com/${p.twitter}`, icon: AtSign, label: "x" },
    p.website && { href: p.website, icon: Globe, label: "site" },
  ].filter(Boolean) as { href: string; icon: typeof Globe; label: string }[];

  return (
    <Card>
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Avatar url={p.avatar_url} className="size-20" />
          <div className="flex flex-col gap-1">
            <span className="text-2xl">{p.name}</span>
            <span className="text-xs text-muted-foreground">
              inscrit le {formatDate(p.created_at)}
            </span>
            {actions}
          </div>
        </div>
        <Divider />
        <div className="grid flex-1 grid-cols-3 gap-4">
          <Stat label="lectures lancées" value={formatNumber(p.sessions_started)} />
          <Stat label="lectures finies" value={formatNumber(p.sessions_completed)} />
          <Stat label="temps de lecture" value={formatDuration(p.time_ms)} />
        </div>
        {links.length > 0 && (
          <>
            <Divider />
            <div className="flex gap-2 md:flex-col">
              {links.map(({ href, icon: Icon, label }) => (
                <Button key={label} variant="text" size="icon" asChild>
                  <a href={href} target="_blank" rel="noreferrer nofollow" aria-label={label}>
                    <Icon />
                  </a>
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
      {p.bio && <p className="mt-6 whitespace-pre-line">{p.bio}</p>}
    </Card>
  );
}

function RankStat({ label, rank }: { label: string; rank: Rank }) {
  const top = rank ? Math.max(0.01, (rank.rank / rank.total) * 100) : null;
  return (
    <div className="flex items-center justify-end gap-4">
      <div className="flex flex-col items-end">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">
          {top === null ? "-" : `top ${top.toFixed(top < 1 ? 2 : 1)}%`}
        </span>
      </div>
      <span className="text-4xl">{rank ? formatRank(rank.rank) : "-"}</span>
    </div>
  );
}

export function RankCard({ data }: { data: ProfileData }) {
  return (
    <Card>
      <div className="grid items-center gap-4 md:grid-cols-3">
        <span className="text-muted-foreground">classements de tous les temps</span>
        <RankStat label="mots lus" rank={data.wordsRank} />
        <RankStat label="temps de lecture" rank={data.timeRank} />
      </div>
    </Card>
  );
}

function Best({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-4xl">{value}</span>
      <span className="text-muted-foreground">{sub ?? " "}</span>
    </div>
  );
}

export function BestsCard({ data }: { data: ProfileData }) {
  const p = data.profile;
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <div className="grid grid-cols-3 gap-4">
          <Best label="mots lus" value={formatNumber(p.words_read)} />
          <Best
            label="plus longue session"
            value={p.longest_session_words ? formatNumber(p.longest_session_words) : "-"}
            sub={p.longest_session_ms ? formatDuration(p.longest_session_ms) : undefined}
          />
          <Best
            label="vitesse habituelle"
            value={p.usual_wpm ? String(p.usual_wpm) : "-"}
            sub={p.usual_wpm ? "mots/min" : undefined}
          />
        </div>
      </Card>
      <Card>
        <div className="grid grid-cols-3 gap-4">
          <Best label="série en cours" value={String(p.current_streak)} sub="jours" />
          <Best label="meilleure série" value={String(p.best_streak)} sub="jours" />
          <Best label="jours actifs" value={formatNumber(p.active_days)} />
        </div>
      </Card>
    </div>
  );
}

export { Card };
