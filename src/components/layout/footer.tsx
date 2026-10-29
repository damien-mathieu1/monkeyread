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
import { useT } from "@/lib/i18n";

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="rounded bg-muted px-1.5 py-0.5 text-foreground">{children}</kbd>;
}

function KeyTips({ settings }: { settings: Settings }) {
  const t = useT();
  return (
    <div className="flex flex-col items-center gap-2">
      {settings.quickRestart !== "off" && (
        <div>
          <Kbd>{settings.quickRestart}</Kbd> - {t.keys.restart}
        </div>
      )}
      <div>
        <Kbd>{t.keys.space}</Kbd> - {t.keys.playPause}
      </div>
      <div>
        <Kbd>←</Kbd> <Kbd>→</Kbd> - {t.keys.prevNext} · <Kbd>j</Kbd> <Kbd>l</Kbd> -{" "}
        {t.keys.skip(settings.skipSeconds)}
      </div>
      <div>
        <Kbd>↑</Kbd> <Kbd>↓</Kbd> - {t.keys.speed} · <Kbd>1–5</Kbd> - {t.keys.chunk} · <Kbd>p</Kbd>{" "}
        - {t.reader.punctuationPause} · <Kbd>t</Kbd> - {t.reader.text}
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
  const t = useT();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t.footer.contact}</DialogTitle>
        </DialogHeader>
        <p>
          {t.footer.contactBody(
            <Link href="/security" className="text-primary hover:underline">
              {t.footer.security}
            </Link>,
          )}
        </p>
        <div className="grid grid-cols-3 gap-2">
          <BigLink
            icon={MessageCircleQuestion}
            label={t.footer.question}
            href={`${REPO_URL}/discussions`}
          />
          <BigLink
            icon={Lightbulb}
            label={t.footer.idea}
            href={`${REPO_URL}/issues/new?template=feature_request.yml`}
          />
          <BigLink
            icon={Bug}
            label={t.footer.bug}
            href={`${REPO_URL}/issues/new?template=bug_report.yml`}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SupportDialog({ open, onOpenChange }: DialogProps) {
  const t = useT();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t.footer.supportTitle}</DialogTitle>
        </DialogHeader>
        <p>{t.footer.supportBody}</p>
        <div className="grid grid-cols-3 gap-2">
          <BigLink icon={Star} label={t.footer.star} href={REPO_URL} />
          <BigLink icon={Share2} label={t.footer.share} href="https://monkeyread.eu" />
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
  return THEMES.find((theme) => theme.id === id)?.name;
}

const COMMIT = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;

/** Pass `settings` to show the reader's keyboard tips above the links. */
export function Footer({ settings }: { settings?: Settings }) {
  const [dialog, setDialog] = useState<"contact" | "support" | null>(null);
  const theme = useThemeName();
  const t = useT();
  const close = (open: boolean) => !open && setDialog(null);

  return (
    <footer className="grid gap-8 text-xs text-muted-foreground">
      {settings?.showKeyTips && <KeyTips settings={settings} />}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <nav className="flex flex-wrap">
          <FooterLink icon={Mail} onClick={() => setDialog("contact")}>
            {t.footer.contact}
          </FooterLink>
          <FooterLink icon={Heart} onClick={() => setDialog("support")}>
            {t.footer.support}
          </FooterLink>
          <FooterLink icon={Code} href={REPO_URL} external>
            github
          </FooterLink>
          <FooterLink icon={FileText} href="/terms">
            {t.footer.terms}
          </FooterLink>
          <FooterLink icon={Shield} href="/security">
            {t.footer.security}
          </FooterLink>
          <FooterLink icon={Lock} href="/privacy">
            {t.footer.privacy}
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
