import { cn } from "@/lib/utils";

interface MarketingPageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function MarketingPageShell({ children, className }: MarketingPageShellProps) {
  return (
    <div className={cn("min-h-screen flex flex-col relative", className)}>
      <div className="absolute inset-0 mesh-grid pointer-events-none opacity-40" aria-hidden />
      <div className="relative flex flex-col flex-1">{children}</div>
    </div>
  );
}

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function PageHero({ eyebrow, title, description, className }: PageHeroProps) {
  return (
    <header className={cn("mb-12 md:mb-16 animate-fade-up", className)}>
      {eyebrow && (
        <p className="text-emerald-400/90 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-zinc-50 leading-tight tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="mt-5 text-lg text-zinc-500 max-w-2xl leading-relaxed">{description}</p>
      )}
    </header>
  );
}
