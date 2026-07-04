import * as React from "react";
import { cn } from "./cn";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-wood/20 bg-surface px-4 py-2 text-cream placeholder:text-cream/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wood/50 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
