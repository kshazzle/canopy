"use client";

interface ActionChipProps {
  label: string;
  kgCo2Delta: number;
  onClick: () => void;
  disabled?: boolean;
}

export function ActionChip({ label, kgCo2Delta, onClick, disabled }: ActionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="liquid-glass focus-ring rounded-2xl px-5 py-4 text-left transition-transform hover:scale-[1.02] disabled:opacity-50"
      aria-label={`Log action: ${label}, saves ${Math.abs(kgCo2Delta)} kg CO2`}
    >
      <span className="block text-sm text-white">{label}</span>
      <span className="mt-1 block text-xs text-white/60">
        {kgCo2Delta < 0 ? `${kgCo2Delta} kg CO₂` : `+${kgCo2Delta} kg CO₂`}
      </span>
    </button>
  );
}
