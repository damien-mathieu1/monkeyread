// Set by the i18n provider; formatters follow the chosen language.
let locale = "fr-FR";

export function setFormatLocale(next: string) {
  locale = next;
}

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
  return n.toLocaleString(locale);
}

const EN_SUFFIX: Record<string, string> = { one: "st", two: "nd", few: "rd", other: "th" };

export function formatRank(rank: number) {
  if (locale.startsWith("fr")) return rank === 1 ? "1er" : `${formatNumber(rank)}e`;
  return `${formatNumber(rank)}${EN_SUFFIX[new Intl.PluralRules("en", { type: "ordinal" }).select(rank)]}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(locale);
}
