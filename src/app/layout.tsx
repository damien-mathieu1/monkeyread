import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/auth/auth-provider";
import { I18nProvider } from "@/lib/i18n";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "monkeyread",
  description: "RSVP speed reading, monkeytype-style.",
};

// Applies saved theme and font before first paint to avoid a flash.
const bootScript = `try{var s=JSON.parse(localStorage.getItem("monkeyread-settings"));var d=document.documentElement.dataset;if(s.theme)d.theme=s.theme;if(s.fontFamily)d.font=s.fontFamily}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      data-theme="serika_dark"
      data-font="roboto-mono"
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <I18nProvider>
          <AuthProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </AuthProvider>
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
