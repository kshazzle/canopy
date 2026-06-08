import { GlassButton } from "./GlassButton";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full object-cover"
        poster="/hero-poster.jpg"
      >
        <source src="/hero-earth.webm" type="video/webm" />
      </video>

      <div className="absolute inset-0 z-[1] bg-black/40" aria-hidden="true" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <main
          id="main-content"
          className="flex flex-1 flex-col items-center justify-center px-6 pb-40 pt-32 text-center"
        >
          <h1 className="font-display animate-fade-rise max-w-7xl text-5xl leading-[0.95] tracking-[-2.46px] text-white sm:text-7xl md:text-8xl">
            Live Lighter on the Planet
          </h1>
          <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-white sm:text-lg">
            Understand your carbon footprint, track daily choices, and get
            personalized insights that help you reduce emissions — one smart
            action at a time.
          </p>
          <GlassButton
            href="/onboarding"
            className="animate-fade-rise-delay-2 mt-12 px-14 py-5 text-base"
          >
            Start Assessment
          </GlassButton>
        </main>
      </div>
    </section>
  );
}
