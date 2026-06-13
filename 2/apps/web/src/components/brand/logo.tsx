import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string | null;
  className?: string;
}

const sizes = {
  sm: { img: 28, text: "text-sm" },
  md: { img: 36, text: "text-base" },
  lg: { img: 48, text: "text-lg" },
};

export function Logo({ size = "md", showText = true, href = "/", className }: LogoProps) {
  const s = sizes[size];
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/logo.png"
        alt="RistoProfit OS"
        width={s.img}
        height={s.img}
        className="rounded-lg shrink-0"
        priority
      />
      {showText && (
        <span className="flex flex-col leading-none">
          <span className={cn("font-display font-semibold tracking-tight text-stone-900", s.text)}>
            RistoProfit
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-700 font-medium mt-0.5">
            OS
          </span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}