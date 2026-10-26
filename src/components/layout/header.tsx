import { BookOpen } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center gap-2">
      <BookOpen className="size-8 text-primary" />
      <div className="flex flex-col">
        <span className="text-xs leading-none text-muted-foreground">monkey read</span>
        <span className="text-3xl leading-none">monkeyread</span>
      </div>
    </header>
  );
}
