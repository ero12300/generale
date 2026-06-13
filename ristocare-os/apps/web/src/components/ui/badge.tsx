import { cn } from "@/lib/utils";

const variants = {
  default: "bg-white/5 text-zinc-300 border border-white/10",
  success: "bg-emerald-600/20 text-emerald-300 border border-emerald-600/30",
  warning: "bg-amber-600/20 text-amber-300 border border-amber-600/30",
  danger: "bg-red-600/20 text-red-300 border border-red-600/30",
  info: "bg-sky-600/20 text-sky-300 border border-sky-600/30",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
