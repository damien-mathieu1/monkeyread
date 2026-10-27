export function formatDuration(ms: number) {
  const s = Math.floor(ms / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

/** Rough time left, rounded up to the minute: "4 min", "1 h 05". */
export function formatRemaining(ms: number) {
  const m = Math.max(1, Math.ceil(ms / 60000));
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}`;
}

export function formatNumber(n: number) {
  return n.toLocaleString("fr-FR");
}

export function formatRank(rank: number) {
  return rank === 1 ? "1er" : `${formatNumber(rank)}e`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
