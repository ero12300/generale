import type { ActionResult } from "@/app/actions";

export function ActionMessage({ result }: { result: ActionResult | null }) {
  if (!result) return null;
  return (
    <p
      role="status"
      className={
        result.ok
          ? "rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300"
          : "rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
      }
    >
      {result.message}
    </p>
  );
}
