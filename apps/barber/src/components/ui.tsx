import clsx from "clsx";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "danger";
}) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-gold-500 text-ink-950 hover:bg-gold-400 shadow-[0_0_24px_-8px] shadow-gold-500/60",
        variant === "outline" &&
          "border border-gold-500/40 text-gold-300 hover:border-gold-400 hover:bg-gold-500/10",
        variant === "ghost" && "text-cream/70 hover:bg-white/5 hover:text-cream",
        variant === "danger" &&
          "border border-red-400/30 text-red-300 hover:bg-red-500/10",
        className,
      )}
      {...props}
    />
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-white/8 bg-ink-900/80 p-6 shadow-xl shadow-black/30 backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-semibold uppercase tracking-widest text-cream/60"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const inputClasses =
  "w-full rounded-xl border border-white/10 bg-ink-800/80 px-4 py-2.5 text-sm text-cream placeholder:text-cream/30 focus:border-gold-500/60 focus:outline-none focus:ring-1 focus:ring-gold-500/40";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx(inputClasses, props.className)} {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={clsx(inputClasses, props.className)} {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={clsx(inputClasses, props.className)} {...props} />;
}

export function Badge({
  tone = "gold",
  children,
}: {
  tone?: "gold" | "green" | "red" | "neutral";
  children: ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        tone === "gold" && "bg-gold-500/15 text-gold-300",
        tone === "green" && "bg-emerald-500/15 text-emerald-300",
        tone === "red" && "bg-red-500/15 text-red-300",
        tone === "neutral" && "bg-white/10 text-cream/60",
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="space-y-3">
      {eyebrow ? (
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-400">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-semibold text-cream md:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-2xl text-sm leading-relaxed text-cream/60">{subtitle}</p>
      ) : null}
    </div>
  );
}

export function Spinner({ label = "Caricamento…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-cream/60" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gold-500/30 border-t-gold-400" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function EmptyState({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
      <p className="text-sm font-semibold text-cream/70">{title}</p>
      {hint ? <p className="mt-1 text-xs text-cream/40">{hint}</p> : null}
    </div>
  );
}
