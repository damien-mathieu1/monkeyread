"use client";

import { useState } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <section>
      <Button
        variant="text"
        className="mb-8 h-auto gap-4 p-0 text-4xl"
        onClick={() => setOpen((o) => !o)}
      >
        <ChevronDown
          className={cn("size-8 transition-transform duration-125", !open && "-rotate-90")}
        />
        {title}
      </Button>
      {open && <div className="grid animate-in gap-8 duration-125 fade-in">{children}</div>}
    </section>
  );
}

type SettingProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function Setting({ icon: Icon, title, description, children }: SettingProps) {
  return (
    <div className="grid gap-2">
      <h3 className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        {title}
      </h3>
      <div className="grid gap-2 md:grid-cols-3 md:gap-x-8">
        <p className="md:col-span-2">{description}</p>
        <div>{children}</div>
      </div>
    </div>
  );
}

type Option<T> = { value: T; label: string };

export function OptionButtons<T extends string | number | boolean>({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  columns?: 1 | 2 | 3 | 4 | 5;
}) {
  return (
    <div
      className={cn(
        "grid gap-2",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-3",
        columns === 4 && "grid-cols-4",
        columns === 5 && "grid-cols-5",
      )}
    >
      {options.map((o) => (
        <Button
          key={String(o.value)}
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </Button>
      ))}
    </div>
  );
}

export const ON_OFF: Option<boolean>[] = [
  { value: false, label: "off" },
  { value: true, label: "on" },
];
