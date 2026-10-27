"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, TriangleAlert, User, UserPen } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { CenteredMessage, PageShell } from "@/components/layout/page-shell";
import { Setting } from "@/components/settings/setting";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "account", label: "compte", icon: User },
  { id: "auth", label: "authentification", icon: KeyRound },
  { id: "danger", label: "zone dangereuse", icon: TriangleAlert },
] as const;

function Status({ text }: { text: { msg: string; error: boolean } }) {
  if (!text.msg) return null;
  return (
    <p className={cn("text-sm", text.error ? "text-destructive" : "text-muted-foreground")}>
      {text.msg}
    </p>
  );
}

function RenameSetting({ current, onDone }: { current: string; onDone: () => void }) {
  const [name, setName] = useState(current);
  const [status, setStatus] = useState({ msg: "", error: false });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.rpc("rename_me", { p_name: name });
    if (error) return setStatus({ msg: "pseudo indisponible ou invalide", error: true });
    setStatus({ msg: "pseudo mis à jour", error: false });
    onDone();
  };

  return (
    <Setting
      icon={UserPen}
      title="changer de pseudo"
      description="3 à 20 caractères : lettres, chiffres, _ . - L'adresse de ton profil public change aussi."
    >
      <form onSubmit={save} className="grid gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          minLength={3}
          maxLength={20}
          required
        />
        <Button type="submit" disabled={name === current}>
          changer
        </Button>
        <Status text={status} />
      </form>
    </Setting>
  );
}

function PasswordSetting() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ msg: "", error: false });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    setStatus(
      error
        ? { msg: error.message, error: true }
        : { msg: "mot de passe mis à jour", error: false },
    );
    if (!error) setPassword("");
  };

  return (
    <Setting
      icon={KeyRound}
      title="mot de passe"
      description="Définis ou change le mot de passe de ton compte. Utile aussi pour te connecter par email si tu t'es inscrit avec Google, GitHub ou Discord."
    >
      <form onSubmit={save} className="grid gap-2">
        <Input
          type="password"
          placeholder="nouveau mot de passe"
          value={password}
          minLength={8}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">enregistrer</Button>
        <Status text={status} />
      </form>
    </Setting>
  );
}

function DeleteSetting({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const remove = async () => {
    const { error } = await supabase.rpc("delete_me");
    if (error) return setError(error.message);
    await supabase.auth.signOut({ scope: "local" });
    router.replace("/");
  };

  return (
    <Setting
      icon={TriangleAlert}
      title="supprimer le compte"
      description="Supprime ton compte, ton profil, tes réglages et tout ton historique de lecture. Irréversible."
    >
      <Button variant="destructive" className="w-full" onClick={() => setOpen(true)}>
        supprimer le compte
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>supprimer le compte</DialogTitle>
          </DialogHeader>
          <p>
            Tape <span className="text-primary">{name}</span> pour confirmer. Tout ton historique
            sera perdu.
          </p>
          <Input value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          {error && <p className="text-destructive">{error}</p>}
          <Button variant="destructive" disabled={confirm !== name} onClick={remove}>
            supprimer définitivement
          </Button>
        </DialogContent>
      </Dialog>
    </Setting>
  );
}

export default function AccountSettingsPage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("account");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setTab("auth");
    });
    return () => data.subscription.unsubscribe();
  }, []);

  if (!profile) {
    return (
      <PageShell>
        <CenteredMessage>chargement...</CenteredMessage>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="grid gap-8 md:grid-cols-4">
        <nav className="flex h-max flex-col gap-1 rounded-lg bg-muted p-4">
          {TABS.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant="text"
              className="justify-start"
              aria-pressed={tab === id}
              onClick={() => setTab(id)}
            >
              <Icon />
              {label}
            </Button>
          ))}
        </nav>
        <div className="grid content-start gap-8 md:col-span-3">
          {tab === "account" && (
            <RenameSetting current={profile.name} onDone={() => void refreshProfile()} />
          )}
          {tab === "auth" && <PasswordSetting />}
          {tab === "danger" && <DeleteSetting name={profile.name} />}
        </div>
      </div>
    </PageShell>
  );
}
