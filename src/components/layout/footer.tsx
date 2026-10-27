"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bug,
  Code,
  FileText,
  GitBranch,
  Heart,
  Lightbulb,
  Lock,
  Mail,
  MessageCircleQuestion,
  Palette,
  Share2,
  Shield,
  Star,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { REPO_URL } from "@/components/layout/doc";
import type { Settings } from "@/hooks/use-settings";
import { THEMES } from "@/lib/themes";

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="rounded bg-muted px-1.5 py-0.5 text-foreground">{children}</kbd>;
}

function KeyTips({ settings }: { settings: Settings }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {settings.quickRestart !== "off" && (
        <div>
          <Kbd>{settings.quickRestart}</Kbd> - recommencer
        </div>
      )}
      <div>
        <Kbd>espace</Kbd> - lecture / pause
      </div>
      <div>
        <Kbd>←</Kbd> <Kbd>→</Kbd> - mot précédent / suivant
      </div>
    </div>
  );
}

function FooterLink({
  icon: Icon,
  href,
  external,
  onClick,
  children,
}: {
  icon: LucideIcon;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const content = (
    <>
      <Icon />
      {children}
    </>
  );
  if (!href) {
    return (
      <Button variant="text" size="xs" onClick={onClick}>
        {content}
      </Button>
    );
  }
  return (
    <Button variant="text" size="xs" asChild>
      {external ? (
        <a href={href} target="_blank" rel="noreferrer">
          {content}
        </a>
      ) : (
        <Link href={href}>{content}</Link>
      )}
    </Button>
  );
}

function BigLink({ icon: Icon, href, label }: { icon: LucideIcon; href: string; label: string }) {
  return (
    <Button className="h-auto flex-col gap-2 py-4" asChild>
      <a href={href} target="_blank" rel="noreferrer">
        <Icon className="size-6" />
        {label}
      </a>
    </Button>
  );
}

function ContactDialog({ open, onOpenChange }: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>contact</DialogTitle>
        </DialogHeader>
        <p>
          Tout passe par GitHub : une question, une idée ou un bug, ouvre un ticket et je réponds
          là-bas. Pour une faille de sécurité, lis plutôt la page{" "}
          <Link href="/security" className="text-primary hover:underline">
            sécurité
          </Link>
          .
        </p>
        <div className="grid grid-cols-3 gap-2">
          <BigLink icon={MessageCircleQuestion} label="question" href={`${REPO_URL}/discussions`} />
          <BigLink
            icon={Lightbulb}
            label="idée"
            href={`${REPO_URL}/issues/new?template=feature_request.yml`}
          />
          <BigLink icon={Bug} label="bug" href={`${REPO_URL}/issues/new?template=bug_report.yml`} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SupportDialog({ open, onOpenChange }: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>soutenir monkeyread</DialogTitle>
        </DialogHeader>
        <p>
          monkeyread est gratuit, sans pub et le restera. Pour aider : mets une étoile au projet,
          parles-en autour de toi, ou soutiens monkeytype, sans qui ce site n&apos;existerait pas.
        </p>
        <div className="grid grid-cols-3 gap-2">
          <BigLink icon={Star} label="étoile GitHub" href={REPO_URL} />
          <BigLink icon={Share2} label="partager" href="https://monkeyread.dmathieu.dev" />
          <BigLink icon={Heart} label="monkeytype" href="https://monkeytype.com" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

type DialogProps = { open: boolean; onOpenChange: (open: boolean) => void };

function useThemeName() {
  const [id, setId] = useState<string>();
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setId(root.dataset.theme);
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return THEMES.find((t) => t.id === id)?.name;
}

const COMMIT = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;

/** Pass `settings` to show the reader's keyboard tips above the links. */
export function Footer({ settings }: { settings?: Settings }) {
  const [dialog, setDialog] = useState<"contact" | "support" | null>(null);
  const theme = useThemeName();
  const close = (open: boolean) => !open && setDialog(null);

  return (
    <footer className="grid gap-8 text-xs text-muted-foreground">
      {settings?.showKeyTips && <KeyTips settings={settings} />}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <nav className="flex flex-wrap">
          <FooterLink icon={Mail} onClick={() => setDialog("contact")}>
            contact
          </FooterLink>
          <FooterLink icon={Heart} onClick={() => setDialog("support")}>
            soutenir
          </FooterLink>
          <FooterLink icon={Code} href={REPO_URL} external>
            github
          </FooterLink>
          <FooterLink icon={FileText} href="/terms">
            conditions
          </FooterLink>
          <FooterLink icon={Shield} href="/security">
            sécurité
          </FooterLink>
          <FooterLink icon={Lock} href="/privacy">
            confidentialité
          </FooterLink>
        </nav>
        <div className="flex">
          <FooterLink icon={Palette} href="/settings">
            {theme}
          </FooterLink>
          <FooterLink
            icon={GitBranch}
            href={COMMIT ? `${REPO_URL}/commit/${COMMIT}` : REPO_URL}
            external
          >
            {COMMIT ? COMMIT.slice(0, 7) : "dev"}
          </FooterLink>
        </div>
      </div>
      <ContactDialog open={dialog === "contact"} onOpenChange={close} />
      <SupportDialog open={dialog === "support"} onOpenChange={close} />
    </footer>
  );
}
