"use client";

import { useMemo, useState } from "react";
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card } from "@/components/account/profile-cards";
import type { ReadingSession } from "@/lib/supabase";
import { formatDuration, formatNumber } from "@/lib/format";

const PERIODS = [
  { id: "day", label: "dernier jour", days: 1 },
  { id: "week", label: "dernière semaine", days: 7 },
  { id: "month", label: "dernier mois", days: 30 },
  { id: "quarter", label: "3 derniers mois", days: 91 },
  { id: "all", label: "tout", days: Infinity },
] as const;

const chartConfig = {
  words: { label: "mots lus", color: "var(--foreground)" },
  minutes: { label: "minutes", color: "var(--primary)" },
} satisfies ChartConfig;

export function History({ sessions }: { sessions: ReadingSession[] }) {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]["id"]>("all");

  const filtered = useMemo(() => {
    const days = PERIODS.find((p) => p.id === period)!.days;
    const since = Date.now() - days * 86400000;
    return sessions.filter((s) => new Date(s.started_at).getTime() >= since);
  }, [sessions, period]);

  const perDay = useMemo(() => {
    const map = new Map<string, { day: string; words: number; minutes: number }>();
    for (const s of filtered) {
      const day = s.started_at.slice(0, 10);
      const row = map.get(day) ?? { day, words: 0, minutes: 0 };
      row.words += s.words_read;
      row.minutes += s.duration_ms / 60000;
      map.set(day, row);
    }
    return [...map.values()]
      .sort((a, b) => a.day.localeCompare(b.day))
      .map((r) => ({ ...r, minutes: Math.round(r.minutes * 10) / 10 }));
  }, [filtered]);

  const totals = filtered.reduce(
    (t, s) => ({ words: t.words + s.words_read, ms: t.ms + s.duration_ms }),
    { words: 0, ms: 0 },
  );
  const wpmPerHour = totals.ms > 0 ? Math.round(totals.words / (totals.ms / 3600000)) : 0;

  return (
    <div className="grid gap-8">
      <div className="grid gap-2">
        <span className="text-muted-foreground">filtres</span>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          {PERIODS.map((p) => (
            <Button key={p.id} aria-pressed={period === p.id} onClick={() => setPeriod(p.id)}>
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <div className="grid gap-4">
          <ChartContainer config={chartConfig} className="h-72 w-full">
            <ComposedChart data={perDay}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis yAxisId="words" tickLine={false} axisLine={false} />
              <YAxis yAxisId="minutes" orientation="right" tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                yAxisId="words"
                dataKey="words"
                fill="var(--color-words)"
                radius={4}
                maxBarSize={32}
              />
              <Line
                yAxisId="minutes"
                dataKey="minutes"
                stroke="var(--color-minutes)"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ChartContainer>
          <p className="text-muted-foreground">
            {formatNumber(totals.words)} mots en {formatDuration(totals.ms)} ·{" "}
            {formatNumber(wpmPerHour)} mots par heure de lecture
          </p>
        </div>
      </Card>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-muted-foreground">
            <tr>
              <th className="p-2 font-normal">date</th>
              <th className="p-2 font-normal">mots</th>
              <th className="p-2 font-normal">durée</th>
              <th className="p-2 font-normal">vitesse</th>
              <th className="p-2 font-normal">texte</th>
            </tr>
          </thead>
          <tbody>
            {filtered
              .slice(-50)
              .reverse()
              .map((s) => (
                <tr key={s.id} className="odd:bg-muted">
                  <td className="p-2">{new Date(s.started_at).toLocaleString("fr-FR")}</td>
                  <td className="p-2">{formatNumber(s.words_read)}</td>
                  <td className="p-2">{formatDuration(s.duration_ms)}</td>
                  <td className="p-2">{s.wpm}</td>
                  <td className="p-2 text-muted-foreground">
                    {s.completed ? "fini" : `${Math.round((s.words_read / s.total_words) * 100)}%`}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-muted-foreground">aucune lecture sur cette période</p>
        )}
      </div>
    </div>
  );
}
