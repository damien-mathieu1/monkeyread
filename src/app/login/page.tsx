"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";
import type { Provider } from "@supabase/supabase-js";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { accountsEnabled, supabase } from "@/lib/supabase";

const PROVIDERS: { id: Provider; label: string }[] = [
  { id: "google", label: "google" },
  { id: "github", label: "github" },
  { id: "discord", label: "discord" },
];

function Message({ text, error }: { text: string; error?: boolean }) {
  if (!text) return null;
  return <p className={error ? "text-destructive" : "text-muted-foreground"}>{text}</p>;
}

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [nameFree, setNameFree] = useState<boolean | null>(null);
  const [message, setMessage] = useState({ text: "", error: false });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!/^[A-Za-z0-9_.-]{3,20}$/.test(name)) return setNameFree(null);
    const id = setTimeout(async () => {
      const { data } = await supabase.rpc("name_available", { p_name: name });
      setNameFree(data ?? null);
    }, 300);
    return () => clearTimeout(id);
  }, [name]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm)
      return setMessage({ text: "les mots de passe diffèrent", error: true });
    if (nameFree === false) return setMessage({ text: "pseudo déjà pris", error: true });
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name }, emailRedirectTo: `${location.origin}/account` },
    });
    setBusy(false);
    if (error) return setMessage({ text: error.message, error: true });
    if (!data.session)
      setMessage({ text: "vérifie tes emails pour confirmer le compte", error: false });
  };

  return (
    <form onSubmit={submit} className="grid gap-2">
      <h2 className="flex items-center gap-2 text-muted-foreground">
        <UserPlus className="size-4" />
        inscription
      </h2>
      <Input
        placeholder="pseudo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-invalid={nameFree === false}
        required
        minLength={3}
        maxLength={20}
        pattern="[A-Za-z0-9_.\-]+"
        title="3 à 20 caractères : lettres, chiffres, _ . -"
      />
      <Input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
      />
      <Input
        type="password"
        placeholder="confirme le mot de passe"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      <Button type="submit" disabled={busy}>
        <UserPlus />
        s&apos;inscrire
      </Button>
      <Message {...message} />
    </form>
  );
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", error: false });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setMessage({ text: error.message, error: true });
  };

  const forgot = async () => {
    if (!email) return setMessage({ text: "entre ton email d'abord", error: true });
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/account/settings`,
    });
    setMessage(
      error
        ? { text: error.message, error: true }
        : { text: "email de réinitialisation envoyé", error: false },
    );
  };

  return (
    <div className="grid gap-2">
      <h2 className="flex items-center gap-2 text-muted-foreground">
        <LogIn className="size-4" />
        connexion
      </h2>
      <div className="grid grid-cols-3 gap-2">
        {PROVIDERS.map((p) => (
          <Button
            key={p.id}
            onClick={() =>
              supabase.auth.signInWithOAuth({
                provider: p.id,
                options: { redirectTo: `${location.origin}/account` },
              })
            }
          >
            {p.label}
          </Button>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground">ou</p>
      <form onSubmit={submit} className="grid gap-2">
        <Input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={busy}>
          <LogIn />
          se connecter
        </Button>
      </form>
      <Button variant="text" size="sm" className="justify-self-end" onClick={forgot}>
        mot de passe oublié ?
      </Button>
      <Message {...message} />
    </div>
  );
}

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/account");
  }, [user, router]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-8 py-8">
      <Header />
      <main className="grid flex-1 content-center gap-16 md:grid-cols-2">
        {accountsEnabled ? (
          <>
            <Register />
            <SignIn />
          </>
        ) : (
          <p className="text-center text-muted-foreground md:col-span-2">
            Les comptes ne sont pas configurés sur cette instance.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
