"use client";

import type { CSSProperties } from "react";

const LEAVES = [
  { left: "8%", top: "12%", scale: 1.1, rot: -28, dur: "32s", delay: "0s", drift: "42px" },
  { left: "72%", top: "8%", scale: 0.85, rot: 18, dur: "38s", delay: "4s", drift: "-36px" },
  { left: "88%", top: "45%", scale: 1, rot: -12, dur: "34s", delay: "8s", drift: "-28px" },
  { left: "22%", top: "55%", scale: 0.75, rot: 32, dur: "40s", delay: "2s", drift: "34px" },
  { left: "48%", top: "18%", scale: 0.9, rot: -8, dur: "36s", delay: "6s", drift: "24px" },
  { left: "62%", top: "72%", scale: 1.15, rot: 22, dur: "42s", delay: "10s", drift: "-40px" },
  { left: "5%", top: "78%", scale: 0.8, rot: -35, dur: "37s", delay: "12s", drift: "30px" },
];

export function DriftingLeaves() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[13] overflow-hidden"
      aria-hidden="true"
    >
      {LEAVES.map((leaf, i) => (
        <svg
          key={i}
          viewBox="0 0 20 28"
          className="drifting-leaf"
          style={
            {
              left: leaf.left,
              top: leaf.top,
              "--scale": leaf.scale,
              "--rot": `${leaf.rot}deg`,
              "--dur": leaf.dur,
              "--delay": leaf.delay,
              "--drift": leaf.drift,
            } as CSSProperties
          }
        >
          <defs>
            <linearGradient id={`leaf-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(196, 165, 116, 0.55)" />
              <stop offset="50%" stopColor="rgba(143, 174, 120, 0.35)" />
              <stop offset="100%" stopColor="rgba(196, 165, 116, 0.15)" />
            </linearGradient>
          </defs>
          <path
            d="M10 1 C16 6, 18 14, 10 27 C2 14, 4 6, 10 1 Z"
            fill={`url(#leaf-grad-${i})`}
          />
          <path
            d="M10 4 L10 24"
            stroke="rgba(245, 237, 224, 0.15)"
            strokeWidth="0.5"
            fill="none"
          />
        </svg>
      ))}
    </div>
  );
}
