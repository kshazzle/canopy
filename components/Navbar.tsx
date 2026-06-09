"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useProfile } from "@/hooks/useCanopyData";
import { GlassButton } from "./GlassButton";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
] as const;

const APP_LINKS = [
  { href: "/dashboard", label: "Insights" },
  { href: "/track", label: "Track" },
  { href: "/actions", label: "Actions" },
] as const;

interface NavbarProps {
  compact?: boolean;
}

export function Navbar({ compact = false }: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const profile = useProfile();

  const navLinks = useMemo(
    () => (profile ? [PUBLIC_LINKS[0], ...APP_LINKS, PUBLIC_LINKS[1]] : [...PUBLIC_LINKS]),
    [profile],
  );

  return (
    <header className="relative z-10">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[#f5ede0] focus:px-4 focus:py-2 focus:text-[#0a0705]"
      >
        Skip to main content
      </a>
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between px-6 md:px-10 ${
          compact ? "py-4" : "py-7"
        }`}
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="font-display text-[1.65rem] tracking-tight text-[#f5ede0]"
        >
          Canopy<sup className="ml-0.5 text-[0.55rem] text-[#c4a574]">®</sup>
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`text-[0.8rem] tracking-wide transition-all duration-500 ${
                  pathname === link.href
                    ? "text-[#f5ede0]"
                    : "text-[#f5ede0]/55 hover:text-[#f5ede0]/85"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="mt-1 block h-px w-full bg-[#c4a574]/60" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="focus-ring rounded-full p-2 text-[#f5ede0]/80 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true" className="text-lg">
              {menuOpen ? "✕" : "☰"}
            </span>
          </button>
          {profile ? (
            <GlassButton
              href="/dashboard"
              className="hidden px-5 py-2 text-[0.78rem] tracking-wide sm:inline-flex"
            >
              My Insights
            </GlassButton>
          ) : (
            <GlassButton
              href="/onboarding"
              className="hidden px-5 py-2 text-[0.78rem] tracking-wide sm:inline-flex"
            >
              Start Assessment
            </GlassButton>
          )}
        </div>
      </nav>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="glass-panel border-t border-[#f5ede0]/8 px-6 py-5 md:hidden"
        >
          <ul className="space-y-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className="block text-sm text-[#f5ede0]/80"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <GlassButton
                href={profile ? "/dashboard" : "/onboarding"}
                className="px-5 py-2.5 text-sm"
              >
                {profile ? "My Insights" : "Start Assessment"}
              </GlassButton>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
