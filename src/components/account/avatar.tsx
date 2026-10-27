import { User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Avatar({ url, className }: { url: string | null; className?: string }) {
  return url ? (
    // oxlint-disable-next-line nextjs/no-img-element -- OAuth avatars come from many hosts.
    <img src={url} alt="" className={cn("rounded-full object-cover", className)} />
  ) : (
    <span
      className={cn(
        "flex items-center justify-center rounded-full bg-muted-foreground text-background",
        className,
      )}
    >
      <User className="size-1/2" />
    </span>
  );
}
