import Link from "next/link";
import { BookOpen, BookOpenText, Info, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <nav className="flex items-center gap-1">
        <Button variant="text" size="icon" asChild>
          <Link href="/" aria-label="lecture">
            <BookOpenText />
          </Link>
        </Button>
        <Button variant="text" size="icon" asChild>
          <Link href="/about" aria-label="à propos">
            <Info />
          </Link>
        </Button>
        <Button variant="text" size="icon" asChild>
          <Link href="/settings" aria-label="réglages">
            <Settings />
          </Link>
        </Button>
      </nav>
    </header>
  );
}
