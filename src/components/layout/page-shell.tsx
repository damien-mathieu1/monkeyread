"use client";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-8 py-8">
      <Header />
      <main className="grid flex-1 content-start gap-8">{children}</main>
      <Footer />
    </div>
  );
}

export function CenteredMessage({ children }: { children: React.ReactNode }) {
  return <p className="py-24 text-center text-muted-foreground">{children}</p>;
}
