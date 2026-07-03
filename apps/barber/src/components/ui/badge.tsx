import { cn } from "@/lib/utils";

type Tone = "gold" | "green" | "blue" | "red" | "gray" | "purple";

const tones: Record<Tone, string> = {
  gold: "bg-[var(--gold)]/15 text-[var(--gold-soft)] border-[var(--gold-deep)]/40",
  green: "bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/30",
  blue: "bg-[#5b8def]/15 text-[#8fb4ff] border-[#5b8def]/30",
  red: "bg-[var(--danger)]/15 text-[var(--danger)] border-[var(--danger)]/30",
  gray: "bg-white/5 text-muted border-border",
  purple: "bg-[#a371f7]/15 text-[#c7a6ff] border-[#a371f7]/30",
};

export function Badge({
  tone = "gray",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
