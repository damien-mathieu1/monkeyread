"use client";

import { useMemo } from "react";
import { Card } from "@/components/account/profile-cards";
import type { ActivityDay } from "@/hooks/use-profile-data";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate, formatDuration, formatNumber } from "@/lib/format";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LEVELS = [
  "bg-background",
  "bg-muted-foreground/30",
  "bg-muted-foreground/60",
  "bg-foreground/70",
  "bg-foreground",
];
const DAY_MS = 86400000;

function utcDay(d: Date) {
  return d.toISOString().slice(0, 10);
}

// 53 weeks x 7 days ending today (UTC), Monday-first rows like monkeytype.
export function ActivityGrid({ activity }: { activity: ActivityDay[] }) {
  const t = useT();
  const { weeks, max, monthLabels, totalSessions } = useMemo(() => {
    const byDay = new Map(activity.map((a) => [a.day, a]));
    const today = new Date(utcDay(new Date()));
    const mondayOffset = (today.getUTCDay() + 6) % 7;
    const start = new Date(today.getTime() - (52 * 7 + mondayOffset) * DAY_MS);
    const weeks: { day: string; data?: ActivityDay; future: boolean }[][] = [];
    const monthLabels: { col: number; month: number }[] = [];
    for (let w = 0; w < 53; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(start.getTime() + (w * 7 + d) * DAY_MS);
        const day = utcDay(date);
        week.push({ day, data: byDay.get(day), future: date > today });
        if (date.getUTCDate() === 1) monthLabels.push({ col: w, month: date.getUTCMonth() });
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
          <span>{t.activity.summary(formatNumber(totalSessions))}</span>
          <span className="flex items-center gap-1 text-xs">
            {t.activity.less}
            {LEVELS.map((c) => (
              <span key={c} className={cn("size-3 rounded-sm", c)} />
            ))}
            {t.activity.more}
          </span>
        </div>
        <div className="flex w-max gap-1">
          {weeks.map((week, w) => (
            <div key={w} className="flex flex-col gap-1">
              {week.map(({ day, data, future }) =>
                future ? (
                  <span key={day} className="invisible size-3" />
                ) : (
                  <Tooltip key={day}>
                    <TooltipTrigger asChild>
                      <span className={cn("size-3 rounded-sm", LEVELS[level(data?.words_read)])} />
                    </TooltipTrigger>
                    <TooltipContent className="grid text-center">
                      <span>{formatDate(`${day}T12:00:00Z`)}</span>
                      <span>
                        {data
                          ? `${t.library.words(formatNumber(data.words_read))} · ${formatDuration(data.time_ms)}`
                          : t.activity.none}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                ),
              )}
            </div>
          ))}
        </div>
        <div className="relative h-4 text-xs text-muted-foreground">
          {monthLabels.map(({ col, month }) => (
            <span key={`${col}-${month}`} className="absolute" style={{ left: `${col * 1}rem` }}>
              {t.activity.months[month]}
            </span>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">{t.activity.utc}</p>
      </div>
    </Card>
  );
}
