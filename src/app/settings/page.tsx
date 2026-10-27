"use client";

import {
  ALargeSmall,
  Crosshair,
  Gauge,
  Keyboard,
  LayoutList,
  Pause,
  TriangleAlert,
  RotateCcw,
  Timer,
  Type,
  Volume2,
  VolumeX,
  Highlighter,
  Palette,
} from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ON_OFF, OptionButtons, Section, Setting } from "@/components/settings/setting";
import { FONT_SIZES } from "@/components/reader/word-display";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useSettings } from "@/hooks/use-settings";
import { FONTS } from "@/lib/font-list";
import { SOUNDS, playSound } from "@/lib/sound";
import { THEMES } from "@/lib/themes";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { settings, update, resetAll } = useSettings();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-8 py-8">
      <Header />

      <main className="grid flex-1 gap-16">
        <Section title="comportement">
          <Setting
            icon={RotateCcw}
            title="recommencer rapidement"
            description="Recommence la lecture depuis le début avec tab ou échap."
          >
            <OptionButtons
              columns={3}
              options={[
                { value: "off", label: "off" },
                { value: "tab", label: "tab" },
                { value: "esc", label: "esc" },
              ]}
              value={settings.quickRestart}
              onChange={(v) => update("quickRestart", v)}
            />
          </Setting>
          <Setting
            icon={Pause}
            title="pause ponctuation"
            description="Reste plus longtemps sur les fins de phrase et les virgules pour laisser le temps au sens de se poser."
          >
            <OptionButtons
              options={ON_OFF}
              value={settings.punctuationPause}
              onChange={(v) => update("punctuationPause", v)}
            />
          </Setting>
        </Section>

        <Section title="lecture">
          <Setting icon={Gauge} title="vitesse" description="Nombre de mots affichés par minute.">
            <Input
              key={settings.wpm}
              type="number"
              min={50}
              max={2000}
              defaultValue={settings.wpm}
              onBlur={(e) => {
                const v = Math.round(Number(e.target.value));
                if (v >= 50 && v <= 2000) update("wpm", v);
                else e.target.value = String(settings.wpm);
              }}
              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            />
          </Setting>
          <Setting
            icon={LayoutList}
            title="mots groupés"
            description="Nombre de mots affichés en même temps."
          >
            <OptionButtons
              columns={3}
              options={[1, 2, 3].map((n) => ({ value: n, label: String(n) }))}
              value={settings.chunkSize}
              onChange={(v) => update("chunkSize", v)}
            />
          </Setting>
          <Setting
            icon={Highlighter}
            title="lettre mise en avant"
            description="Colore la lettre sur laquelle l'œil doit se poser."
          >
            <OptionButtons
              options={ON_OFF}
              value={settings.highlightLetter}
              onChange={(v) => update("highlightLetter", v)}
            />
          </Setting>
          <Setting
            icon={Crosshair}
            title="repères"
            description="Affiche les lignes et les traits qui marquent le point de fixation."
          >
            <OptionButtons
              options={ON_OFF}
              value={settings.showGuides}
              onChange={(v) => update("showGuides", v)}
            />
          </Setting>
          <Setting
            icon={Timer}
            title="progression"
            description="Comment afficher l'avancement de la lecture."
          >
            <OptionButtons
              columns={4}
              options={[
                { value: "off", label: "off" },
                { value: "bar", label: "barre" },
                { value: "text", label: "texte" },
                { value: "mini", label: "mini" },
              ]}
              value={settings.progressStyle}
              onChange={(v) => update("progressStyle", v)}
            />
          </Setting>
        </Section>

        <Section title="son">
          <Setting icon={Volume2} title="volume" description="Volume du son joué à chaque mot.">
            <div className="flex items-center gap-4">
              <span className="w-8 text-muted-foreground">{settings.soundVolume.toFixed(1)}</span>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[settings.soundVolume]}
                onValueChange={([v]) => update("soundVolume", v)}
                onValueCommit={([v]) => playSound(settings.sound, v)}
              />
            </div>
          </Setting>
          <Setting
            icon={VolumeX}
            title="son à chaque mot"
            description="Joue un petit son à chaque mot affiché, comme un métronome."
          >
            <OptionButtons
              columns={3}
              options={SOUNDS.map((s) => ({ value: s, label: s }))}
              value={settings.sound}
              onChange={(v) => {
                update("sound", v);
                playSound(v, settings.soundVolume);
              }}
            />
          </Setting>
        </Section>

        <Section title="apparence">
          <Setting
            icon={ALargeSmall}
            title="taille du texte"
            description="Taille des mots pendant la lecture."
          >
            <OptionButtons
              columns={3}
              options={FONT_SIZES.map((n) => ({ value: n, label: String(n) }))}
              value={settings.fontSize}
              onChange={(v) => update("fontSize", v)}
            />
          </Setting>
          <Setting icon={Type} title="police" description="Police utilisée dans toute l'app.">
            <span className="text-muted-foreground">
              {FONTS.find((f) => f.id === settings.fontFamily)?.name}
            </span>
          </Setting>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {FONTS.map((f) => (
              <Button
                key={f.id}
                data-font={f.id}
                className="font-sans"
                aria-pressed={settings.fontFamily === f.id}
                onClick={() => update("fontFamily", f.id)}
              >
                {f.name}
              </Button>
            ))}
          </div>
        </Section>

        <Section title="thème">
          <Setting icon={Palette} title="thème" description="Couleurs de l'interface.">
            <span className="text-muted-foreground">
              {THEMES.find((t) => t.id === settings.theme)?.name}
            </span>
          </Setting>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                data-theme={t.id}
                onClick={() => update("theme", t.id)}
                className={cn(
                  "flex items-center justify-between rounded-lg bg-background px-4 py-2 text-foreground transition-transform duration-125 hover:scale-105",
                  settings.theme === t.id && "ring-2 ring-primary",
                )}
              >
                {t.name}
                <span className="flex gap-1">
                  <span className="size-3 rounded-full bg-primary" />
                  <span className="size-3 rounded-full bg-muted-foreground" />
                  <span className="size-3 rounded-full bg-foreground" />
                </span>
              </button>
            ))}
          </div>
        </Section>

        <Section title="masquer des éléments">
          <Setting
            icon={Keyboard}
            title="raccourcis clavier"
            description="Affiche les raccourcis en bas de la page de lecture."
          >
            <OptionButtons
              options={[
                { value: false, label: "masquer" },
                { value: true, label: "afficher" },
              ]}
              value={settings.showKeyTips}
              onChange={(v) => update("showKeyTips", v)}
            />
          </Setting>
        </Section>

        <Section title="zone dangereuse">
          <Setting
            icon={TriangleAlert}
            title="réinitialiser les réglages"
            description="Remet tous les réglages à leur valeur par défaut. Irréversible."
          >
            <Button variant="destructive" className="w-full" onClick={resetAll}>
              réinitialiser
            </Button>
          </Setting>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
