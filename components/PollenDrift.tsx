"use client";

import type { CSSProperties } from "react";

interface PollenDriftProps {
  count?: number;
}

const POLLEN_SEEDS = [
  { left: "6%", top: "22%", w: 3, h: 5, rot: 12, dur: "22s", delay: "0s", dx: "18px", dy: "-34px", opacity: 0.35 },
  { left: "18%", top: "68%", w: 2, h: 4, rot: -8, dur: "26s", delay: "1.5s", dx: "-14px", dy: "-28px", opacity: 0.28 },
  { left: "34%", top: "14%", w: 2, h: 3, rot: 20, dur: "20s", delay: "0.8s", dx: "10px", dy: "-40px", opacity: 0.32 },
  { left: "52%", top: "48%", w: 3, h: 4, rot: -15, dur: "24s", delay: "2.2s", dx: "-8px", dy: "-22px", opacity: 0.25 },
  { left: "71%", top: "32%", w: 2, h: 5, rot: 6, dur: "19s", delay: "0.4s", dx: "16px", dy: "-30px", opacity: 0.3 },
  { left: "88%", top: "58%", w: 2, h: 3, rot: -22, dur: "27s", delay: "3s", dx: "-12px", dy: "-26px", opacity: 0.22 },
  { left: "42%", top: "76%", w: 3, h: 4, rot: 10, dur: "21s", delay: "1.8s", dx: "6px", dy: "-18px", opacity: 0.26 },
  { left: "58%", top: "8%", w: 2, h: 3, rot: -5, dur: "23s", delay: "4s", dx: "-10px", dy: "-36px", opacity: 0.2 },
  { left: "24%", top: "42%", w: 2, h: 4, rot: 18, dur: "25s", delay: "2.8s", dx: "14px", dy: "-20px", opacity: 0.24 },
  { left: "78%", top: "78%", w: 2, h: 3, rot: -12, dur: "18s", delay: "0.6s", dx: "-6px", dy: "-32px", opacity: 0.27 },
  { left: "12%", top: "86%", w: 3, h: 5, rot: 8, dur: "28s", delay: "3.5s", dx: "12px", dy: "-14px", opacity: 0.18 },
  { left: "64%", top: "62%", w: 2, h: 4, rot: -18, dur: "20s", delay: "1.2s", dx: "-16px", dy: "-24px", opacity: 0.3 },
  { left: "46%", top: "28%", w: 2, h: 3, rot: 14, dur: "24s", delay: "2s", dx: "8px", dy: "-38px", opacity: 0.21 },
  { left: "92%", top: "18%", w: 2, h: 4, rot: -6, dur: "22s", delay: "4.2s", dx: "-10px", dy: "-28px", opacity: 0.23 },
  { left: "8%", top: "52%", w: 2, h: 3, rot: 16, dur: "26s", delay: "1s", dx: "20px", dy: "-16px", opacity: 0.29 },
  { left: "36%", top: "58%", w: 3, h: 4, rot: -10, dur: "19s", delay: "3.8s", dx: "-8px", dy: "-30px", opacity: 0.25 },
  { left: "82%", top: "42%", w: 2, h: 3, rot: 4, dur: "23s", delay: "0.2s", dx: "12px", dy: "-22px", opacity: 0.27 },
  { left: "56%", top: "88%", w: 2, h: 4, rot: -14, dur: "25s", delay: "2.5s", dx: "-14px", dy: "-12px", opacity: 0.2 },
];

export function PollenDrift({ count = 18 }: PollenDriftProps) {
  const grains = POLLEN_SEEDS.slice(0, count);

  return (
    <div className="pointer-events-none absolute inset-0 z-[14]" aria-hidden="true">
      {grains.map((p, i) => (
        <span
          key={i}
          className="pollen-grain"
          style={
            {
              left: p.left,
              top: p.top,
              width: p.w,
              height: p.h,
              "--rot": `${p.rot}deg`,
              "--dur": p.dur,
              "--delay": p.delay,
              "--dx": p.dx,
              "--dy": p.dy,
              "--opacity": p.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
