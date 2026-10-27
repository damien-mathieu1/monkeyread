"use client";

import Link from "next/link";
import {
  BookOpen,
  BookOpenText,
  ChartLine,
  Crown,
  Globe,
  Info,
  Library,
  LogOut,
  Settings,
  User,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth/auth-provider";
import { Avatar } from "@/components/account/avatar";
import { accountsEnabled, supabase } from "@/lib/supabase";
import { useT } from "@/lib/i18n";

function NavIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Button variant="text" size="icon" asChild>
      <Link href={href} aria-label={label}>
        {children}
      </Link>
    </Button>
  );
}

function AccountButton() {
  const { user, profile, loading } = useAuth();
  const t = useT();
  if (loading || !accountsEnabled) return null;
  if (!user || !profile) {
    return (
      <NavIcon href="/login" label={t.nav.login}>
        <User />
      </NavIcon>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="text" size="sm" className="gap-2">
          <Avatar url={profile.avatar_url} className="size-5" />
          {profile.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-max">
        <DropdownMenuItem asChild>
          <Link href="/account">
            <ChartLine />
            {t.nav.stats}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/profile/${profile.name}`}>
            <Globe />
            {t.nav.publicProfile}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/settings">
            <UserCog />
            {t.nav.accountSettings}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void supabase.auth.signOut()}>
          <LogOut />
          {t.nav.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const t = useT();
  return (
    <header className="flex items-center gap-4">
      <Link href="/" className="flex items-center gap-2">
        <BookOpen className="size-8 text-primary" />
        <div className="flex flex-col">
          <span className="text-xs leading-none text-muted-foreground">monkey read</span>
          <span className="text-3xl leading-none">monkeyread</span>
        </div>
      </Link>
      <nav className="flex flex-1 items-center gap-1">
        <NavIcon href="/" label={t.nav.read}>
          <BookOpenText />
        </NavIcon>
        <NavIcon href="/library" label={t.nav.library}>
          <Library />
        </NavIcon>
        {accountsEnabled && (
          <NavIcon href="/leaderboards" label={t.nav.leaderboards}>
            <Crown />
          </NavIcon>
        )}
        <NavIcon href="/about" label={t.nav.about}>
          <Info />
        </NavIcon>
        <NavIcon href="/settings" label={t.nav.settings}>
          <Settings />
        </NavIcon>
        <div className="flex-1" />
        <AccountButton />
      </nav>
    </header>
  );
}
