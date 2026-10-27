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
import { formatDateTime, formatDuration, formatNumber } from "@/lib/format";
import { useT } from "@/lib/i18n";

const PERIODS = [
  { id: "day", days: 1 },
  { id: "week", days: 7 },
  { id: "month", days: 30 },
  { id: "quarter", days: 91 },
  { id: "all", days: Infinity },
] as const;

export function History({ sessions }: { sessions: ReadingSession[] }) {
  const t = useT();
  const [period, setPeriod] = useState<(typeof PERIODS)[number]["id"]>("all");
  const chartConfig = {
    words: { label: t.history.wordsRead, color: "var(--foreground)" },
    minutes: { label: t.history.minutes, color: "var(--primary)" },
  } satisfies ChartConfig;

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
    (sum, s) => ({ words: sum.words + s.words_read, ms: sum.ms + s.duration_ms }),
    { words: 0, ms: 0 },
  );
  const wpmPerHour = totals.ms > 0 ? Math.round(totals.words / (totals.ms / 3600000)) : 0;

  return (
    <div className="grid gap-8">
      <div className="grid gap-2">
        <span className="text-muted-foreground">{t.history.filters}</span>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          {PERIODS.map((p) => (
            <Button key={p.id} aria-pressed={period === p.id} onClick={() => setPeriod(p.id)}>
              {t.history.periods[p.id]}
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
            {t.history.summary(
              formatNumber(totals.words),
              formatDuration(totals.ms),
              formatNumber(wpmPerHour),
            )}
          </p>
        </div>
      </Card>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-muted-foreground">
            <tr>
              <th className="p-2 font-normal">{t.history.columns.date}</th>
              <th className="p-2 font-normal">{t.history.columns.words}</th>
              <th className="p-2 font-normal">{t.history.columns.duration}</th>
              <th className="p-2 font-normal">{t.history.columns.speed}</th>
              <th className="p-2 font-normal">{t.history.columns.text}</th>
            </tr>
          </thead>
          <tbody>
            {filtered
              .slice(-50)
              .reverse()
              .map((s) => (
                <tr key={s.id} className="odd:bg-muted">
                  <td className="p-2">{formatDateTime(s.started_at)}</td>
                  <td className="p-2">{formatNumber(s.words_read)}</td>
                  <td className="p-2">{formatDuration(s.duration_ms)}</td>
                  <td className="p-2">{s.wpm}</td>
                  <td className="p-2 text-muted-foreground">
                    {s.completed
                      ? t.history.finished
                      : `${Math.round((s.words_read / s.total_words) * 100)}%`}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-muted-foreground">{t.history.empty}</p>
        )}
      </div>
    </div>
  );
}
