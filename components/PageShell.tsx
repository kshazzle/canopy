import { AmbientBackground } from "./AmbientBackground";
import { Navbar } from "./Navbar";

interface PageShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  centered?: boolean;
  /** Lock content to one viewport — no page scroll */
  fitViewport?: boolean;
  /** Smaller page title so step content can dominate */
  compactTitle?: boolean;
  /** Poster-only background with no motion */
  staticBackground?: boolean;
  /** hero = home page atmosphere; subtle = light motion; static = frozen poster */
  background?: "hero" | "subtle" | "static";
  /** Allow vertical scroll inside a fitViewport shell when content may overflow */
  scrollable?: boolean;
}

export function PageShell({
  children,
  title,
  subtitle,
  centered = false,
  fitViewport = false,
  compactTitle = false,
  staticBackground = false,
  background,
  scrollable = false,
}: PageShellProps) {
  const intensity = background ?? (staticBackground ? "static" : "subtle");
  const isStatic = intensity === "static";

  return (
    <div
      className={`relative overflow-hidden bg-[#0a0705] text-[#f5ede0] ${
        fitViewport
          ? "flex h-dvh max-h-dvh flex-col"
          : "min-h-screen"
      } ${isStatic ? "page-static" : ""}`}
    >
      <AmbientBackground intensity={intensity} />

      <div
        className={`relative z-10 flex flex-col ${
          fitViewport ? "min-h-0 flex-1" : "min-h-screen"
        }`}
      >
        <Navbar compact={fitViewport} />

        <main
          id="main-content"
          className={`mx-auto w-full max-w-7xl flex-1 px-6 md:px-10 ${
            fitViewport
              ? `flex min-h-0 flex-col py-3 md:py-4 ${scrollable ? "overflow-y-auto" : "overflow-hidden"}`
              : "py-14 md:py-20"
          } ${centered ? "flex flex-col items-center" : ""}`}
        >
          {title && (
            <header
              className={`shrink-0 ${
                fitViewport
                  ? `mb-2 max-w-xl ${centered ? "text-center" : ""}`
                  : `mb-14 ${centered ? "max-w-2xl text-center" : "max-w-3xl"}`
              }`}
            >
              <h1
                className={`font-display tracking-[-0.02em] text-[#f5ede0] ${
                  compactTitle
                    ? "text-[clamp(1.2rem,3vw,1.55rem)] leading-[1.1] text-[#f5ede0]/85"
                    : fitViewport
                      ? "mt-2 text-[clamp(1.65rem,4vw,2.35rem)] leading-[1.05] [@media(max-height:740px)]:mt-1 [@media(max-height:740px)]:text-[1.5rem]"
                      : "mt-5 text-[clamp(2.25rem,5vw,4rem)] leading-[1.02]"
                }`}
              >
                {title}
              </h1>
              {subtitle && (
                <p
                  className={`leading-relaxed text-[#f5ede0]/60 ${
                    fitViewport
                      ? "mt-2 text-[0.82rem] sm:text-[0.88rem] [@media(max-height:740px)]:mt-1 [@media(max-height:740px)]:text-[0.78rem]"
                      : "mt-5 text-[0.95rem] sm:text-base"
                  }`}
                >
                  {subtitle}
                </p>
              )}
            </header>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
