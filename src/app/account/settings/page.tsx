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
import { useT } from "@/lib/i18n";

const TABS = [
  { id: "account", icon: User },
  { id: "auth", icon: KeyRound },
  { id: "danger", icon: TriangleAlert },
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
  const t = useT();
  const [name, setName] = useState(current);
  const [status, setStatus] = useState({ msg: "", error: false });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.rpc("rename_me", { p_name: name });
    if (error) return setStatus({ msg: t.accountSettings.rename.invalid, error: true });
    setStatus({ msg: t.accountSettings.rename.done, error: false });
    onDone();
  };

  return (
    <Setting
      icon={UserPen}
      title={t.accountSettings.rename.title}
      description={t.accountSettings.rename.description}
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
          {t.accountSettings.rename.button}
        </Button>
        <Status text={status} />
      </form>
    </Setting>
  );
}

function PasswordSetting() {
  const t = useT();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ msg: "", error: false });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    setStatus(
      error
        ? { msg: error.message, error: true }
        : { msg: t.accountSettings.password.done, error: false },
    );
    if (!error) setPassword("");
  };

  return (
    <Setting
      icon={KeyRound}
      title={t.accountSettings.password.title}
      description={t.accountSettings.password.description}
    >
      <form onSubmit={save} className="grid gap-2">
        <Input
          type="password"
          placeholder={t.accountSettings.password.placeholder}
          value={password}
          minLength={8}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">{t.common.save}</Button>
        <Status text={status} />
      </form>
    </Setting>
  );
}

function DeleteSetting({ name }: { name: string }) {
  const t = useT();
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
      title={t.accountSettings.delete.title}
      description={t.accountSettings.delete.description}
    >
      <Button variant="destructive" className="w-full" onClick={() => setOpen(true)}>
        {t.accountSettings.delete.title}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.accountSettings.delete.title}</DialogTitle>
          </DialogHeader>
          <p>{t.accountSettings.delete.confirm(<span className="text-primary">{name}</span>)}</p>
          <Input value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          {error && <p className="text-destructive">{error}</p>}
          <Button variant="destructive" disabled={confirm !== name} onClick={remove}>
            {t.accountSettings.delete.button}
          </Button>
        </DialogContent>
      </Dialog>
    </Setting>
  );
}

export default function AccountSettingsPage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const t = useT();
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
        <CenteredMessage>{t.common.loading}</CenteredMessage>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="grid gap-8 md:grid-cols-4">
        <nav className="flex h-max flex-col gap-1 rounded-lg bg-muted p-4">
          {TABS.map(({ id, icon: Icon }) => (
            <Button
              key={id}
              variant="text"
              className="justify-start"
              aria-pressed={tab === id}
              onClick={() => setTab(id)}
            >
              <Icon />
              {t.accountSettings.tabs[id]}
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
