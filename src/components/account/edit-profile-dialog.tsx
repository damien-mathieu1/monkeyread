"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase, type Profile } from "@/lib/supabase";
import { useT } from "@/lib/i18n";

type Props = {
  profile: Profile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function EditProfileDialog({ profile, open, onOpenChange, onSaved }: Props) {
  const t = useT();
  const [form, setForm] = useState(profile);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        bio: form.bio.trim(),
        github: form.github.trim(),
        twitter: form.twitter.trim().replace(/^@/, ""),
        website: form.website.trim(),
        show_activity: form.show_activity,
      })
      .eq("id", profile.id);
    setBusy(false);
    if (error) return setError(t.account.invalidLinks);
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setForm(profile);
          setError("");
        }
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t.account.editProfile}</DialogTitle>
        </DialogHeader>
        <form onSubmit={save} className="grid gap-4">
          <p className="text-sm text-muted-foreground">{t.account.editIntro}</p>
          <Field label="bio">
            <Textarea
              value={form.bio}
              maxLength={250}
              onChange={(e) => set("bio", e.target.value)}
            />
            <span className="text-xs">{form.bio.length}/250</span>
          </Field>
          <Field label="github">
            <div className="flex items-center gap-2">
              <span>https://github.com/</span>
              <Input
                value={form.github}
                maxLength={39}
                onChange={(e) => set("github", e.target.value)}
              />
            </div>
          </Field>
          <Field label="x">
            <div className="flex items-center gap-2">
              <span>https://x.com/</span>
              <Input
                value={form.twitter}
                maxLength={16}
                onChange={(e) => set("twitter", e.target.value)}
              />
            </div>
          </Field>
          <Field label={t.profile.website}>
            <Input
              type="url"
              placeholder="https://"
              value={form.website}
              maxLength={200}
              onChange={(e) => set("website", e.target.value)}
            />
          </Field>
          <label className="flex items-center gap-3">
            <Switch checked={form.show_activity} onCheckedChange={(v) => set("show_activity", v)} />
            {t.account.showActivity}
          </label>
          {error && <p className="text-destructive">{error}</p>}
          <Button type="submit" disabled={busy}>
            {t.common.save}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
