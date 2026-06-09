const WHISPERS = [
  "First, understand your rhythm.",
  "Then, notice the small shifts.",
  "Let insight find its way to you.",
];

export function HeroWhisper() {
  return (
    <div
      className="hero-whisper animate-fade-rise-delay-4 w-full max-w-md shrink-0 pb-5 pt-1 text-center sm:pb-7 [@media(max-height:800px)]:pb-4"
      aria-hidden="true"
    >
      {WHISPERS.map((line, i) => (
        <p
          key={line}
          className="hero-whisper-line font-display text-[0.92rem] italic leading-[1.6] sm:text-[1.02rem]"
          data-line={i}
        >
          {line}
        </p>
      ))}
    </div>
  );
}
