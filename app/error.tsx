"use client";

import { GlassButton } from "@/components/GlassButton";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#0a0705] px-6 text-center text-[#f5ede0]">
      <h1 className="font-display text-3xl">Something went wrong</h1>
      <p className="mt-4 max-w-md text-sm text-[#f5ede0]/70">
        An unexpected error occurred. You can try again without losing data stored
        in your browser.
      </p>
      <GlassButton onClick={reset} className="mt-8 px-8 py-3 text-sm">
        Try again
      </GlassButton>
    </main>
  );
}
