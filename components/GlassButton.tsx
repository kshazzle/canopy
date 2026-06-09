import Link from "next/link";
import type { ReactNode } from "react";

interface GlassButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
  ariaLabel?: string;
  variant?: "default" | "premium" | "ghost";
  disabled?: boolean;
  /** Keep premium styling without animated border, glow, or shine */
  motionless?: boolean;
}

function PremiumButtonContent({ children }: { children: ReactNode }) {
  return (
    <>
      <span className="cta-premium-glow" aria-hidden="true" />
      <span className="cta-premium-shine" aria-hidden="true" />
      <span className="cta-premium-reflect" aria-hidden="true" />
      <span className="relative z-10">{children}</span>
    </>
  );
}

export function GlassButton({
  href,
  onClick,
  children,
  className = "",
  type = "button",
  ariaLabel,
  variant = "default",
  disabled = false,
  motionless = false,
}: GlassButtonProps) {
  const base =
    variant === "premium"
      ? `cta-premium focus-ring rounded-full${motionless ? " cta-premium--static" : ""}`
      : variant === "ghost"
        ? "focus-ring rounded-full border border-[#f5ede0]/15 bg-transparent text-[#f5ede0]/70 transition-all duration-500 hover:border-[#c4a574]/30 hover:text-[#f5ede0]"
        : "liquid-glass focus-ring rounded-full text-[#f5ede0] transition-transform duration-500 hover:scale-[1.03]";

  const classes = `${base} inline-flex items-center justify-center ${
    disabled ? "pointer-events-none opacity-35" : ""
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {variant === "premium" ? (
          <PremiumButtonContent>{children}</PremiumButtonContent>
        ) : (
          children
        )}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      {variant === "premium" ? (
        <PremiumButtonContent>{children}</PremiumButtonContent>
      ) : (
        children
      )}
    </button>
  );
}
