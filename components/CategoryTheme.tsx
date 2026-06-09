import type { FootprintCategory } from "@/lib/types";

interface CategoryThemeProps {
  category: FootprintCategory;
}

export function CategoryTheme({ category }: CategoryThemeProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      aria-hidden="true"
    >
      {category === "transport" && <TransportMotif />}
      {category === "diet" && <DietMotif />}
      {category === "energy" && <EnergyMotif />}
      {category === "shopping" && <ShoppingMotif />}
      {category === "waste" && <WasteMotif />}
    </div>
  );
}

function TransportMotif() {
  return (
    <>
      <div
        className="absolute inset-x-0 bottom-[18%] h-px opacity-20"
        style={{
          background:
            "repeating-linear-gradient(90deg, #c4a574 0 12px, transparent 12px 24px)",
        }}
      />
      <div className="absolute inset-x-0 bottom-[18%] h-px translate-y-3 bg-[#f5ede0]/5" />
      <svg
        className="absolute right-6 top-6 h-5 w-5 opacity-[0.14]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path
          d="M4 16h16M6 12h12M8 8h8"
          className="text-[#c4a574]"
          strokeLinecap="round"
        />
      </svg>
    </>
  );
}

function DietMotif() {
  return (
    <>
      <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-[#6b8f5e]/10 blur-2xl" />
      <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-[#c4a574]/8 blur-xl" />
      <svg
        className="absolute left-6 top-6 h-6 w-6 opacity-[0.16]"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 3c-2 4-6 6-6 10a6 6 0 1012 0c0-4-4-6-6-10z"
          fill="#6b8f5e"
          opacity="0.5"
        />
      </svg>
    </>
  );
}

function EnergyMotif() {
  return (
    <>
      <div
        className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(232,168,124,0.18) 0%, transparent 70%)",
        }}
      />
      <svg
        className="absolute right-7 top-7 h-5 w-5 opacity-[0.2]"
        viewBox="0 0 24 24"
        fill="#e8a87c"
      >
        <path d="M13 2L4 14h7l-1 8 10-14h-7l0-6z" />
      </svg>
    </>
  );
}

function ShoppingMotif() {
  return (
    <>
      <svg
        className="absolute right-6 top-6 h-7 w-7 opacity-[0.12]"
        viewBox="0 0 32 32"
        fill="none"
        stroke="#c4a574"
        strokeWidth="1"
      >
        <rect x="6" y="10" width="20" height="16" rx="2" />
        <path d="M6 14h20M12 10V7a4 4 0 018 0v3" strokeLinecap="round" />
      </svg>
      <div className="absolute bottom-6 left-6 h-8 w-8 rotate-12 border border-[#c4a574]/15" />
    </>
  );
}

function WasteMotif() {
  return (
    <>
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 80%, #6b5a3e 1px, transparent 1px), radial-gradient(circle at 70% 30%, #8a7355 1px, transparent 1px)",
          backgroundSize: "24px 24px, 32px 32px",
        }}
      />
      <svg
        className="absolute left-6 top-6 h-6 w-6 opacity-[0.14]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8a9a6e"
        strokeWidth="1.2"
      >
        <path
          d="M12 4a8 8 0 100 16 8 8 0 000-16z"
          strokeDasharray="3 4"
        />
        <path d="M8 12h8M12 8v8" strokeLinecap="round" opacity="0.6" />
      </svg>
    </>
  );
}
