"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Crown,
  Globe,
  Sun,
  Type,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Avatar } from "@/components/account/avatar";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { formatDuration, formatNumber, formatRank } from "@/lib/format";
import { supabase, type LeaderboardRow } from "@/lib/supabase";
import { formatDate } from "@/lib/format";
import { useT } from "@/lib/i18n";

const PERIODS = [
  { id: "all", icon: Globe },
  { id: "week", icon: CalendarDays },
  { id: "day", icon: Sun },
] as const;
const METRICS = [
  { id: "words", icon: Type },
  { id: "time", icon: Clock },
] as const;
const PAGE = 50;

type Period = (typeof PERIODS)[number]["id"];
type Metric = (typeof METRICS)[number]["id"];
type MyRank = {
  rank: number;
  total: number;
  words_read: number;
  time_ms: number;
  sessions: number;
} | null;

function Picker<T extends string>({
  items,
  labels,
  value,
  onChange,
}: {
  items: readonly { id: T; icon: typeof Globe }[];
  labels: Record<T, string>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid gap-2 rounded-lg bg-muted p-4">
      {items.map(({ id, icon: Icon }) => (
        <Button
          key={id}
          variant="text"
          className="justify-start"
          aria-pressed={value === id}
          onClick={() => onChange(id)}
        >
          <Icon />
          {labels[id]}
        </Button>
      ))}
    </div>
  );
}

export default function LeaderboardsPage() {
  const { profile } = useAuth();
  const t = useT();
  const [period, setPeriod] = useState<Period>("all");
  const [metric, setMetric] = useState<Metric>("words");
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<LeaderboardRow[] | null>(null);
  const [mine, setMine] = useState<MyRank>(null);

  useEffect(() => {
    let cancelled = false;
    setRows(null);
    void supabase
      .rpc("leaderboard", {
        p_metric: metric,
        p_period: period,
        p_limit: PAGE,
        p_offset: page * PAGE,
      })
      .then(({ data }) => !cancelled && setRows(data ?? []));
    return () => {
      cancelled = true;
    };
  }, [metric, period, page]);

  useEffect(() => {
    if (!profile) return setMine(null);
    void supabase
      .rpc("leaderboard_rank", { p_metric: metric, p_period: period, p_name: profile.name })
      .then(({ data }) => setMine(data?.[0] ?? null));
  }, [metric, period, profile]);

  const title = `${t.leaderboards.metrics[metric]} · ${t.leaderboards.periods[period]}`;

  return (
    <PageShell>
      <div className="grid gap-8 md:grid-cols-4">
        <div className="grid h-max gap-4">
          <Picker
            items={PERIODS}
            labels={t.leaderboards.periods}
            value={period}
            onChange={(v) => (setPeriod(v), setPage(0))}
          />
          <Picker
            items={METRICS}
            labels={t.leaderboards.metrics}
            value={metric}
            onChange={(v) => (setMetric(v), setPage(0))}
          />
        </div>

        <div className="grid content-start gap-4 md:col-span-3">
          <h1 className="text-4xl">{t.leaderboards.title(title)}</h1>

          {profile && (
            <div className="flex items-center gap-6 rounded-lg bg-muted p-4">
              <span className="w-16">{mine ? formatRank(mine.rank) : "-"}</span>
              <span className="flex-1">
                {t.leaderboards.you}
                {mine && (
                  <span className="text-muted-foreground">
                    {" "}
                    (top {Math.max(0.01, (mine.rank / mine.total) * 100).toFixed(2)}%)
                  </span>
                )}
              </span>
              <span>
                {mine
                  ? t.leaderboards.words(formatNumber(mine.words_read))
                  : t.leaderboards.unranked}
              </span>
              <span>{mine ? formatDuration(mine.time_ms) : ""}</span>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              size="icon"
              aria-label={t.leaderboards.prevPage}
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft />
            </Button>
            <span className="self-center px-2">{t.leaderboards.page(page + 1)}</span>
            <Button
              size="icon"
              aria-label={t.leaderboards.nextPage}
              disabled={!rows || rows.length < PAGE}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight />
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="p-4 font-normal">#</th>
                  <th className="p-4 font-normal">{t.leaderboards.columns.name}</th>
                  <th className="p-4 text-right font-normal">{t.leaderboards.columns.words}</th>
                  <th className="p-4 text-right font-normal">{t.leaderboards.columns.time}</th>
                  <th className="p-4 text-right font-normal">{t.leaderboards.columns.sessions}</th>
                  <th className="p-4 text-right font-normal">{t.leaderboards.columns.lastRead}</th>
                </tr>
              </thead>
              <tbody>
                {rows?.map((r) => (
                  <tr key={r.name} className="odd:bg-muted">
                    <td className="rounded-l-lg p-4">
                      {r.rank === 1 ? <Crown className="size-5" /> : r.rank}
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/profile/${r.name}`}
                        className="flex items-center gap-2 hover:text-primary"
                      >
                        <Avatar url={r.avatar_url} className="size-6" />
                        {r.name}
                      </Link>
                    </td>
                    <td className="p-4 text-right">{formatNumber(r.words_read)}</td>
                    <td className="p-4 text-right">{formatDuration(r.time_ms)}</td>
                    <td className="p-4 text-right">{formatNumber(r.sessions)}</td>
                    <td className="rounded-r-lg p-4 text-right text-muted-foreground">
                      {formatDate(r.last_read)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows?.length === 0 && (
              <p className="p-8 text-center text-muted-foreground">{t.leaderboards.empty}</p>
            )}
            {rows === null && (
              <p className="p-8 text-center text-muted-foreground">{t.common.loading}</p>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
