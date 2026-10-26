// Ids must match the [data-font] selectors in globals.css.
export const FONTS = [
  { id: "roboto-mono", name: "Roboto Mono" },
  { id: "fira-code", name: "Fira Code" },
  { id: "jetbrains-mono", name: "JetBrains Mono" },
  { id: "source-code-pro", name: "Source Code Pro" },
  { id: "courier-prime", name: "Courier Prime" },
  { id: "lexend-deca", name: "Lexend Deca" },
  { id: "inter", name: "Inter" },
  { id: "atkinson", name: "Atkinson Hyperlegible" },
  { id: "literata", name: "Literata" },
  { id: "merriweather", name: "Merriweather" },
] as const;

export type FontId = (typeof FONTS)[number]["id"];
