"use client";

import { useMemo } from "react";
import { Card } from "@/components/account/profile-cards";
import type { ActivityDay } from "@/hooks/use-profile-data";
import { formatDuration, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

const LEVELS = [
  "bg-background",
  "bg-muted-foreground/30",
  "bg-muted-foreground/60",
  "bg-foreground/70",
  "bg-foreground",
];
const MONTHS = [
  "jan",
  "fév",
  "mar",
  "avr",
  "mai",
  "juin",
  "juil",
  "août",
  "sep",
  "oct",
  "nov",
  "déc",
];
const DAY_MS = 86400000;

function utcDay(d: Date) {
  return d.toISOString().slice(0, 10);
}

// 53 weeks x 7 days ending today (UTC), Monday-first rows like monkeytype.
export function ActivityGrid({ activity }: { activity: ActivityDay[] }) {
  const { weeks, max, monthLabels, totalSessions } = useMemo(() => {
    const byDay = new Map(activity.map((a) => [a.day, a]));
    const today = new Date(utcDay(new Date()));
    const mondayOffset = (today.getUTCDay() + 6) % 7;
    const start = new Date(today.getTime() - (52 * 7 + mondayOffset) * DAY_MS);
    const weeks: { day: string; data?: ActivityDay; future: boolean }[][] = [];
    const monthLabels: { col: number; label: string }[] = [];
    for (let w = 0; w < 53; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(start.getTime() + (w * 7 + d) * DAY_MS);
        const day = utcDay(date);
        week.push({ day, data: byDay.get(day), future: date > today });
        if (date.getUTCDate() === 1)
          monthLabels.push({ col: w, label: MONTHS[date.getUTCMonth()] });
      }
      weeks.push(week);
    }
    return {
      weeks,
      monthLabels,
      max: Math.max(1, ...activity.map((a) => a.words_read)),
      totalSessions: activity.reduce((n, a) => n + a.sessions, 0),
    };
  }, [activity]);

  const level = (words = 0) => (words === 0 ? 0 : Math.min(4, Math.ceil((words / max) * 4)));

  return (
    <Card>
      <div className="grid gap-4 overflow-x-auto">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>12 derniers mois · {formatNumber(totalSessions)} lectures</span>
          <span className="flex items-center gap-1 text-xs">
            moins
            {LEVELS.map((c) => (
              <span key={c} className={cn("size-3 rounded-sm", c)} />
            ))}
            plus
          </span>
        </div>
        <div className="flex w-max gap-1">
          {weeks.map((week, w) => (
            <div key={w} className="flex flex-col gap-1">
              {week.map(({ day, data, future }) => (
                <span
                  key={day}
                  title={
                    data
                      ? `${day} : ${formatNumber(data.words_read)} mots, ${formatDuration(data.time_ms)}`
                      : day
                  }
                  className={cn(
                    "size-3 rounded-sm",
                    future ? "invisible" : LEVELS[level(data?.words_read)],
                  )}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="relative h-4 text-xs text-muted-foreground">
          {monthLabels.map(({ col, label }) => (
            <span key={`${col}-${label}`} className="absolute" style={{ left: `${col * 1}rem` }}>
              {label}
            </span>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Les jours sont comptés en heure UTC.
        </p>
      </div>
    </Card>
  );
}
