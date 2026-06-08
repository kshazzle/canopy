"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GlassButton } from "./GlassButton";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Insights" },
  { href: "/track", label: "Track" },
  { href: "/actions", label: "Actions" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-10">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to main content
      </a>
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="font-display text-3xl tracking-tight text-white"
        >
          Canopy<sup className="text-xs">®</sup>
        </Link>

        <ul className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm text-white transition-opacity hover:opacity-80 ${
                  pathname === link.href
                    ? "opacity-100 underline underline-offset-4"
                    : "opacity-90"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="focus-ring rounded-full p-2 text-white md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
          </button>
          <GlassButton href="/onboarding" className="hidden px-6 py-2.5 text-sm sm:inline-flex">
            Start Assessment
          </GlassButton>
        </div>
      </nav>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="border-t border-white/10 bg-black/90 px-8 py-4 md:hidden"
        >
          <ul className="space-y-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-sm text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/onboarding"
                className="liquid-glass focus-ring inline-block rounded-full px-6 py-2.5 text-sm text-white"
                onClick={() => setMenuOpen(false)}
              >
                Start Assessment
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
