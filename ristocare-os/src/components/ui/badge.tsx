import { cn } from "@/lib/utils";

type Tone = "neutral" | "green" | "gold" | "red" | "amber" | "blue";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface-2 text-muted border-border",
  green: "bg-primary/15 text-primary-strong border-primary/30",
  gold: "bg-gold/15 text-gold border-gold/30",
  red: "bg-red-500/15 text-red-300 border-red-500/30",
  amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  blue: "bg-sky-500/15 text-sky-300 border-sky-500/30",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
