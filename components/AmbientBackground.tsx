"use client";

import { useRef } from "react";
import { DriftingFog } from "./DriftingFog";
import { DriftingLeaves } from "./DriftingLeaves";
import { PollenDrift } from "./PollenDrift";

const HERO_VIDEO_MP4 = "/hero-custom.mp4?v=1";
const HERO_VIDEO_WEBM = "/hero-custom.webm?v=1";
const HERO_POSTER = "/hero-custom-poster.jpg?v=1";

interface AmbientBackgroundProps {
  intensity?: "hero" | "subtle" | "static";
}

export function AmbientBackground({ intensity = "hero" }: AmbientBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isHero = intensity === "hero";
  const isStatic = intensity === "static";

  if (isStatic) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_POSTER})` }}
        />
        <div className="atmos-warm absolute inset-0 opacity-90" />
        <div className="vignette-strong absolute inset-0" />
      </div>
    );
  }

  function tryPlay() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => {});
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_POSTER})` }}
      />

      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={HERO_POSTER}
        src={HERO_VIDEO_MP4}
        onLoadedData={tryPlay}
        onCanPlay={tryPlay}
        className={`absolute inset-0 h-full w-full object-cover ${
          isHero ? "camera-push opacity-90" : "opacity-40"
        }`}
      >
        <source src={HERO_VIDEO_MP4} type="video/mp4" />
        <source src={HERO_VIDEO_WEBM} type="video/webm" />
      </video>

      {isHero && <div className="canopy-sway absolute inset-0 z-[8]" />}

      <div className="atmos-warm absolute inset-0" />
      <div className="atmos-fog absolute inset-0" />
      {isHero && <DriftingFog />}
      <div className={isHero ? "vignette absolute inset-0" : "vignette-strong absolute inset-0"} />

      <div
        className="ambient-bloom absolute -left-20 top-1/4 h-64 w-64"
        style={{ background: "rgba(232, 168, 124, 0.15)" }}
      />
      <div
        className="ambient-bloom absolute -right-16 bottom-1/4 h-48 w-48"
        style={{ background: "rgba(196, 165, 116, 0.1)", animationDelay: "3s" }}
      />

      {isHero && <DriftingLeaves />}
      {isHero && <PollenDrift count={14} />}

      <div className="grain" />
    </div>
  );
}
