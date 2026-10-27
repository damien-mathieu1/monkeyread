"use client";

import Link from "next/link";
import {
  BookOpen,
  BookOpenText,
  ChartLine,
  Crown,
  Globe,
  Info,
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
  if (loading || !accountsEnabled) return null;
  if (!user || !profile) {
    return (
      <NavIcon href="/login" label="connexion">
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
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/account">
            <ChartLine />
            statistiques
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/profile/${profile.name}`}>
            <Globe />
            profil public
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/settings">
            <UserCog />
            paramètres du compte
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void supabase.auth.signOut()}>
          <LogOut />
          déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
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
        <NavIcon href="/" label="lecture">
          <BookOpenText />
        </NavIcon>
        {accountsEnabled && (
          <NavIcon href="/leaderboards" label="classements">
            <Crown />
          </NavIcon>
        )}
        <NavIcon href="/about" label="à propos">
          <Info />
        </NavIcon>
        <NavIcon href="/settings" label="réglages">
          <Settings />
        </NavIcon>
        <div className="flex-1" />
        <AccountButton />
      </nav>
    </header>
  );
}
