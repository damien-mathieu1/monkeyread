export const THEMES = [
  { id: "serika_dark", name: "serika dark" },
  { id: "serika", name: "serika" },
  { id: "paper", name: "paper" },
  { id: "nord", name: "nord" },
  { id: "dracula", name: "dracula" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];
