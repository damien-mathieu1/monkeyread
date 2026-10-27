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

/** Time left as its two most significant units: 1 h 5 min, 4 min 12 s, 12 s 340 ms. */
export function remainingParts(ms: number): { value: number; unit: string }[] {
  ms = Math.max(0, Math.round(ms));
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (h > 0)
    return [
      { value: h, unit: "h" },
      { value: m, unit: "min" },
    ];
  if (m > 0)
    return [
      { value: m, unit: "min" },
      { value: s, unit: "s" },
    ];
  return [
    { value: s, unit: "s" },
    { value: ms % 1000, unit: "ms" },
  ];
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
