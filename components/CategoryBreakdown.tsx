import { CATEGORY_LABELS } from "@/lib/constants";
import { CATEGORY_BAR_COLORS } from "@/lib/category-styles";
import type { CategoryBreakdown as Breakdown } from "@/lib/types";

interface CategoryBreakdownProps {
  breakdown: Breakdown[];
}

function buildChartLabel(sorted: Breakdown[]): string {
  return sorted
    .map(
      (item) =>
        `${CATEGORY_LABELS[item.category]} ${item.percentage}% (${item.kgCo2PerYear} kg per year)`,
    )
    .join(", ");
}

export function CategoryBreakdown({ breakdown }: CategoryBreakdownProps) {
  const sorted = [...breakdown].sort((a, b) => b.percentage - a.percentage);
  const chartLabel = buildChartLabel(sorted);

  return (
    <div className="glass-card rounded-3xl p-8">
      <h2 className="font-display text-2xl text-white">Emission Breakdown</h2>
      <p className="mt-2 text-sm text-white/70">Where your carbon footprint comes from</p>

      <div
        className="mt-6 flex h-4 w-full overflow-hidden rounded-full bg-white/10"
        role="img"
        aria-label={`Footprint breakdown by category: ${chartLabel}`}
      >
        {sorted.map((item) => (
          <div
            key={item.category}
            className={`${CATEGORY_BAR_COLORS[item.category]} h-full`}
            style={{ width: `${item.percentage}%` }}
            title={`${CATEGORY_LABELS[item.category]}: ${item.percentage}%`}
          />
        ))}
      </div>

      <ul className="mt-6 space-y-4" aria-label="Category breakdown details">
        {sorted.map((item) => (
          <li key={item.category} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <span
                className={`inline-block h-3 w-3 rounded-full ${CATEGORY_BAR_COLORS[item.category]}`}
                aria-hidden="true"
              />
              <span className="text-white">{CATEGORY_LABELS[item.category]}</span>
            </div>
            <div className="text-right text-white/80">
              <span className="block">{item.percentage}%</span>
              <span className="text-xs text-white/55">{item.kgCo2PerYear} kg/yr</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
