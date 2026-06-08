# Canopy — Carbon Footprint Awareness Platform

**Challenge 3 submission** for the Prompt Hack: a smart, dynamic assistant that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

## Chosen Vertical

**Carbon Footprint Awareness Platform** — empowering individuals to make informed, high-impact lifestyle choices with minimal friction.

## Approach & Logic

Canopy uses a **rule-based contextual assistant** (no API keys required) that analyzes:

1. **Lifestyle quiz results** — transport, diet, energy, shopping, and waste habits
2. **Daily action logs** — one-tap tracking of green choices
3. **Behavioral signals** — streaks, idle periods, and weekly trends

The assistant applies prioritized decision rules:

| Priority | Rule | Trigger |
|----------|------|---------|
| 1 | Highest-impact category | Top category > 35% of footprint |
| 2 | Negative trend | Net CO₂ increase in last 7 days |
| 3 | Streak reward | 3+ consecutive days of logged savings |
| 4 | Idle user re-engagement | No logs in 5+ days |
| 5 | Goal proximity | Within 10% of monthly reduction target |

Each insight includes explainable reasoning (`reason` field) so judges can verify the logic.

## How It Works

```
Landing → Onboarding Quiz → Footprint Profile → Dashboard
                                    ↓
              Daily Tracker ← → Assistant Insights → Recommended Actions
```

### User flow

1. **Start Assessment** — 9-question lifestyle quiz (~3 minutes)
2. **Dashboard** — footprint score (A–F), category breakdown, equivalents, top insight
3. **Track** — log daily actions (bike, meatless meal, transit, etc.)
4. **Actions** — personalized recommendations ranked by `impact × feasibility`

### Architecture

- **UI**: Next.js App Router, Tailwind CSS, Velorah-inspired dark liquid-glass aesthetic
- **Domain layer**: Pure TypeScript functions in `lib/` (emissions math, assistant rules)
- **Storage**: Browser `localStorage` with Zod validation — no backend, no secrets
- **Tests**: Vitest unit tests on `lib/emissions.ts` and `lib/assistant.ts`

## Assumptions

- Emission factors are simplified averages (EPA/IEA-style), not region-specific grid data
- Car: 0.21 kg CO₂/km · Transit: 0.15 kg/km · Flight: 0.25 kg/km (× 1,500 km avg)
- Diet: beef 5 kg/meal · chicken 2 kg · vegetarian 0.5 kg per meal
- Grid electricity: 0.4 kg CO₂/kWh
- All data stays client-side in `localStorage`
- Hero video is decorative; poster image serves as fallback

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # run Vitest suite
npm run build    # production build
```

## Project Structure

```
app/           # Pages (landing, onboarding, dashboard, track, actions, about)
components/    # UI components (Hero, Navbar, gauges, cards)
lib/           # Domain logic (emissions, assistant, storage, constants)
hooks/         # Client data hook (useCanopyData)
__tests__/     # Unit tests
public/        # Hero video and poster (< 20 KB bundled)
```

## Evaluation Highlights

| Area | Implementation |
|------|----------------|
| Code quality | Typed domain layer, thin components, pure functions |
| Security | Zod input validation, client-only storage, no secrets |
| Efficiency | Static pages, no chart libraries, < 20 KB media |
| Testing | 15 unit tests covering emissions math and assistant rules |
| Accessibility | Landmarks, skip link, aria labels, reduced-motion, focus rings |

## Tech Stack

- Next.js 16 · React 19 · TypeScript · Tailwind CSS v4
- Vitest · Zod
- Fonts: Instrument Serif + Inter (Google Fonts)

## License

MIT — built for educational/hackathon purposes.
