"use client";

import {
  ALargeSmall,
  Crosshair,
  FastForward,
  Gauge,
  Keyboard,
  Sparkles,
  Languages,
  LayoutList,
  MoveHorizontal,
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
import {
  NumberInput,
  ON_OFF,
  OptionButtons,
  Section,
  Setting,
} from "@/components/settings/setting";
import { CHUNK_SIZES, MAX_CHUNK_SIZE } from "@/components/reader/config-bar";
import { FONT_SIZES, WordDisplay } from "@/components/reader/word-display";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useSettings, type Settings } from "@/hooks/use-settings";
import { FONTS } from "@/lib/font-list";
import { tokenize } from "@/lib/rsvp";
import { SOUNDS, playSound } from "@/lib/sound";
import { THEMES } from "@/lib/themes";
import { LANGS, useI18n, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Live sample of the reader with the current font, size, theme and display options. */
function ReaderPreview({ settings }: { settings: Settings }) {
  const t = useT();
  return (
    <div className="rounded-lg bg-background px-8">
      <WordDisplay
        chunk={tokenize(t.settings.previewWord)}
        ended={false}
        highlight={settings.highlightLetter}
        guides={settings.showGuides}
        fontSize={settings.fontSize}
      />
    </div>
  );
}

export default function SettingsPage() {
  const { settings, update, resetAll } = useSettings();
  const { t, lang, setLang } = useI18n();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-8 py-8">
      <Header />

      <main className="grid flex-1 gap-16">
        <Section title={t.settings.sections.behavior}>
          <Setting
            icon={Languages}
            title={t.settings.language.title}
            description={t.settings.language.description}
          >
            <OptionButtons
              options={LANGS.map((l) => ({ value: l.id, label: l.name }))}
              value={lang}
              onChange={setLang}
            />
          </Setting>
          <Setting
            icon={RotateCcw}
            title={t.settings.quickRestart.title}
            description={t.settings.quickRestart.description}
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
            title={t.settings.punctuationPause.title}
            description={t.settings.punctuationPause.description}
          >
            <OptionButtons
              options={ON_OFF}
              value={settings.punctuationPause}
              onChange={(v) => update("punctuationPause", v)}
            />
          </Setting>
        </Section>

        <Section title={t.settings.sections.reading}>
          <Setting
            icon={Gauge}
            title={t.settings.speed.title}
            description={t.settings.speed.description}
          >
            <NumberInput
              value={settings.wpm}
              min={50}
              max={2000}
              onChange={(v) => update("wpm", v)}
            />
          </Setting>
          <Setting
            icon={LayoutList}
            title={t.settings.chunkSize.title}
            description={t.settings.chunkSize.description}
          >
            <div className="grid gap-2">
              <OptionButtons
                columns={5}
                options={CHUNK_SIZES.map((n) => ({ value: n, label: String(n) }))}
                value={settings.chunkSize}
                onChange={(v) => update("chunkSize", v)}
              />
              <NumberInput
                value={settings.chunkSize}
                min={1}
                max={MAX_CHUNK_SIZE}
                onChange={(v) => update("chunkSize", v)}
              />
            </div>
          </Setting>
          <Setting
            icon={FastForward}
            title={t.settings.skipSeconds.title}
            description={t.settings.skipSeconds.description}
          >
            <div className="grid gap-2">
              <OptionButtons
                columns={4}
                options={[5, 10, 15, 30].map((n) => ({ value: n, label: `${n} s` }))}
                value={settings.skipSeconds}
                onChange={(v) => update("skipSeconds", v)}
              />
              <NumberInput
                value={settings.skipSeconds}
                min={1}
                max={300}
                onChange={(v) => update("skipSeconds", v)}
              />
            </div>
          </Setting>
          <Setting
            icon={MoveHorizontal}
            title={t.settings.wordStep.title}
            description={t.settings.wordStep.description}
          >
            <div className="grid gap-2">
              <OptionButtons
                columns={4}
                options={[1, 2, 5, 10].map((n) => ({ value: n, label: String(n) }))}
                value={settings.wordStep}
                onChange={(v) => update("wordStep", v)}
              />
              <NumberInput
                value={settings.wordStep}
                min={1}
                max={100}
                onChange={(v) => update("wordStep", v)}
              />
            </div>
          </Setting>
          <Setting
            icon={Highlighter}
            title={t.settings.highlight.title}
            description={t.settings.highlight.description}
          >
            <OptionButtons
              options={ON_OFF}
              value={settings.highlightLetter}
              onChange={(v) => update("highlightLetter", v)}
            />
          </Setting>
          <Setting
            icon={Crosshair}
            title={t.settings.guides.title}
            description={t.settings.guides.description}
          >
            <OptionButtons
              options={ON_OFF}
              value={settings.showGuides}
              onChange={(v) => update("showGuides", v)}
            />
          </Setting>
          <Setting
            icon={Timer}
            title={t.settings.progress.title}
            description={t.settings.progress.description}
          >
            <OptionButtons
              columns={4}
              options={[
                { value: "off", label: "off" },
                { value: "bar", label: t.settings.progress.bar },
                { value: "text", label: t.settings.progress.text },
                { value: "mini", label: "mini" },
              ]}
              value={settings.progressStyle}
              onChange={(v) => update("progressStyle", v)}
            />
          </Setting>
          <Setting
            icon={Sparkles}
            title={t.settings.animateNumbers.title}
            description={t.settings.animateNumbers.description}
          >
            <OptionButtons
              options={ON_OFF}
              value={settings.animateNumbers}
              onChange={(v) => update("animateNumbers", v)}
            />
          </Setting>
        </Section>

        <Section title={t.settings.sections.sound}>
          <Setting
            icon={Volume2}
            title={t.settings.volume.title}
            description={t.settings.volume.description}
          >
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
            title={t.settings.sound.title}
            description={t.settings.sound.description}
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

        <Section title={t.settings.sections.appearance}>
          <ReaderPreview settings={settings} />
          <Setting
            icon={ALargeSmall}
            title={t.settings.fontSize.title}
            description={t.settings.fontSize.description}
          >
            <OptionButtons
              columns={3}
              options={FONT_SIZES.map((n) => ({ value: n, label: String(n) }))}
              value={settings.fontSize}
              onChange={(v) => update("fontSize", v)}
            />
          </Setting>
          <Setting
            icon={Type}
            title={t.settings.font.title}
            description={t.settings.font.description}
          >
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

        <Section title={t.settings.sections.theme}>
          <ReaderPreview settings={settings} />
          <Setting
            icon={Palette}
            title={t.settings.theme.title}
            description={t.settings.theme.description}
          >
            <span className="text-muted-foreground">
              {THEMES.find((th) => th.id === settings.theme)?.name}
            </span>
          </Setting>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {THEMES.map((th) => (
              <button
                key={th.id}
                type="button"
                data-theme={th.id}
                onClick={() => update("theme", th.id)}
                className={cn(
                  "flex items-center justify-between rounded-lg bg-background px-4 py-2 text-foreground transition-transform duration-125 hover:scale-105",
                  settings.theme === th.id && "ring-2 ring-primary",
                )}
              >
                {th.name}
                <span className="flex gap-1">
                  <span className="size-3 rounded-full bg-primary" />
                  <span className="size-3 rounded-full bg-muted-foreground" />
                  <span className="size-3 rounded-full bg-foreground" />
                </span>
              </button>
            ))}
          </div>
        </Section>

        <Section title={t.settings.sections.hideElements}>
          <Setting
            icon={Keyboard}
            title={t.settings.keyTips.title}
            description={t.settings.keyTips.description}
          >
            <OptionButtons
              options={[
                { value: false, label: t.settings.keyTips.hide },
                { value: true, label: t.settings.keyTips.show },
              ]}
              value={settings.showKeyTips}
              onChange={(v) => update("showKeyTips", v)}
            />
          </Setting>
        </Section>

        <Section title={t.settings.sections.dangerZone}>
          <Setting
            icon={TriangleAlert}
            title={t.settings.reset.title}
            description={t.settings.reset.description}
          >
            <Button variant="destructive" className="w-full" onClick={resetAll}>
              {t.settings.reset.button}
            </Button>
          </Setting>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
