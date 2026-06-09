export function DriftingFog() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[12] overflow-hidden" aria-hidden="true">
      <div className="fog-layer fog-layer-1" />
      <div className="fog-layer fog-layer-2" />
      <div className="fog-layer fog-layer-3" />
    </div>
  );
}
