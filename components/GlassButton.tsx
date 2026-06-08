import Link from "next/link";
import type { ReactNode } from "react";

interface GlassButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
  ariaLabel?: string;
}

export function GlassButton({
  href,
  onClick,
  children,
  className = "",
  type = "button",
  ariaLabel,
}: GlassButtonProps) {
  const classes = `liquid-glass focus-ring rounded-full text-white transition-transform hover:scale-[1.03] ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
