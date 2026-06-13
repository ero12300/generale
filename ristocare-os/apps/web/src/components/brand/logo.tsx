import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "light" | "admin";
}

const markSize = { sm: 32, md: 40, lg: 52 } as const;
const textSize = { sm: "text-sm", md: "text-base", lg: "text-lg" } as const;

export function LogoSvg({ className, size = "md" }: { className?: string; size?: keyof typeof markSize }) {
  const px = markSize[size];
  return (
    <svg
      viewBox="0 0 120 120"
      width={px}
      height={px}
      className={cn("shrink-0 drop-shadow-lg drop-shadow-emerald-950/50", className)}
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="rc-shield-ui" x1="20" y1="12" x2="100" y2="108" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22c55e" />
          <stop offset="1" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id="rc-gold-ui" x1="60" y1="28" x2="60" y2="92" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f5d76e" />
          <stop offset="1" stopColor="#c9a227" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="104" height="104" rx="28" fill="url(#rc-shield-ui)" />
      <rect x="8" y="8" width="104" height="104" rx="28" stroke="url(#rc-gold-ui)" strokeWidth="2" opacity="0.85" />
      <g fill="#0c0f0e" opacity="0.92">
        <rect x="32" y="32" width="14" height="14" rx="3" />
        <rect x="74" y="32" width="14" height="14" rx="3" />
        <rect x="32" y="74" width="14" height="14" rx="3" />
        <rect x="74" y="74" width="14" height="14" rx="3" />
        <rect x="53" y="53" width="14" height="14" rx="3" />
      </g>
      <path
        d="M60 44c-8 6-12 12-12 18 0 6.6 5.4 12 12 12s12-5.4 12-12c0-6-4-12-12-18z"
        fill="#ecfdf5"
        opacity="0.95"
      />
      <path d="M60 50v14M54 57h12" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, showWordmark = true, size = "md", variant = "default" }: LogoProps) {
  const titleColor =
    variant === "light" ? "text-white" : variant === "admin" ? "text-amber-50" : "text-zinc-50";
  const subtitleColor =
    variant === "admin" ? "text-amber-200/60" : "text-emerald-200/50";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <LogoSvg size={size} />
      {showWordmark && (
        <div className="leading-tight">
          <p className={cn("font-display font-semibold tracking-tight", textSize[size], titleColor)}>
            RistoCare <span className="text-emerald-400">OS</span>
          </p>
          <p className={cn("text-[10px] uppercase tracking-[0.2em] font-medium", subtitleColor)}>
            Emotive S.r.l.
          </p>
        </div>
      )}
    </div>
  );
}
