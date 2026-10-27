import type { LucideIcon } from "lucide-react";

export function H2({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 pb-2 text-4xl text-muted-foreground">
      <Icon className="size-8" />
      {children}
    </h2>
  );
}

export function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-primary underline-offset-4 hover:underline"
    >
      {children}
    </a>
  );
}

/** Long-form text page body: about, terms, privacy, security. */
export function Doc({ children }: { children: React.ReactNode }) {
  return <div className="grid max-w-3xl gap-12 leading-relaxed">{children}</div>;
}

export function DocSection({
  icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-4">
      <H2 icon={icon}>{title}</H2>
      {children}
    </section>
  );
}

export const REPO_URL = "https://github.com/damien-mathieu1/monkeyread";
