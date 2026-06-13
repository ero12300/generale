import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-primary/60";

export function Field({
  label,
  htmlFor,
  error,
  children,
  required,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-foreground">
        {label} {required ? <span className="text-gold">*</span> : null}
      </label>
      {children}
      {error ? <p className={cn("mt-1 text-xs text-red-300")}>{error}</p> : null}
    </div>
  );
}
