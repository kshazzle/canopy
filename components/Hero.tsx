"use client";

import { AmbientBackground } from "./AmbientBackground";
import { GlassButton } from "./GlassButton";
import { HeroWhisper } from "./HeroWhisper";
import { Navbar } from "./Navbar";

export function Hero() {
  return (
    <section className="relative flex h-dvh max-h-dvh flex-col overflow-hidden bg-[#0a0705]">
      <AmbientBackground intensity="hero" />

      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 50% 48%, rgba(10,7,5,0.55) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <Navbar compact />

        <main
          id="main-content"
          className="flex min-h-0 flex-1 flex-col items-center px-6 text-center"
        >
          <div className="flex flex-1 flex-col items-center justify-center">
            <p className="animate-fade-rise text-[0.65rem] font-medium uppercase tracking-[0.26em] text-[#c4a574]">
              Awareness · Personal rhythm
            </p>

            <h1 className="font-display animate-fade-rise-delay mt-5 max-w-4xl text-[clamp(2.25rem,6.5vw,5.25rem)] leading-[0.93] tracking-[-0.03em] text-[#f5ede0] [@media(max-height:800px)]:mt-3 [@media(max-height:800px)]:text-[clamp(2rem,5.5vw,4.5rem)]">
              Live Lighter
              <br />
              <span className="text-[#f5ede0]/85">on the Planet</span>
            </h1>

            <p className="animate-fade-rise-delay-2 mx-auto mt-6 max-w-md text-[0.88rem] leading-[1.65] text-[#f5ede0]/65 sm:max-w-lg sm:text-[0.95rem]">
              Pay attention to your choices. Notice what shifts.
              Let small actions compound into quiet clarity.
            </p>

            <div className="animate-fade-rise-delay-3 mt-8 flex flex-col items-center gap-3 [@media(max-height:800px)]:mt-5">
              <GlassButton
                href="/onboarding"
                variant="premium"
                className="px-14 py-4 text-[0.9rem] font-medium tracking-wide"
              >
                Begin Your Assessment
              </GlassButton>
              <p className="text-[0.7rem] tracking-wide text-[#f5ede0]/40">
                3 minutes · Just you · No account
              </p>
            </div>
          </div>

          <HeroWhisper />
        </main>
      </div>
    </section>
  );
}
