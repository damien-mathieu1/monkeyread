import {
  Atkinson_Hyperlegible,
  Courier_Prime,
  Fira_Code,
  Inter,
  JetBrains_Mono,
  Lexend_Deca,
  Literata,
  Merriweather,
  Roboto_Mono,
  Source_Code_Pro,
} from "next/font/google";

const robotoMono = Roboto_Mono({ variable: "--font-roboto-mono", subsets: ["latin"] });
const firaCode = Fira_Code({ variable: "--font-fira-code", subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"] });
const sourceCodePro = Source_Code_Pro({ variable: "--font-source-code-pro", subsets: ["latin"] });
const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  subsets: ["latin"],
  weight: "400",
});
const lexendDeca = Lexend_Deca({ variable: "--font-lexend-deca", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  subsets: ["latin"],
  weight: "400",
});
const literata = Literata({ variable: "--font-literata", subsets: ["latin"] });
const merriweather = Merriweather({ variable: "--font-merriweather", subsets: ["latin"] });

export const fontVariables = [
  robotoMono,
  firaCode,
  jetbrainsMono,
  sourceCodePro,
  courierPrime,
  lexendDeca,
  inter,
  atkinson,
  literata,
  merriweather,
]
  .map((f) => f.variable)
  .join(" ");
