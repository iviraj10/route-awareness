import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader } from "@/components/AppShell";
import { Panel } from "@/components/StatCard";
import { accidents } from "@/data/accidents";
import { HIGH_RISK_THRESHOLD, hotspots } from "@/lib/accident-analytics";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety Information — Road Accident Hotspot Analysis" },
      {
        name: "description",
        content:
          "Road safety precautions, guidance for accident-prone areas and general recommendations for drivers and pedestrians.",
      },
      { property: "og:title", content: "Safety Information — Road Accident Hotspot Analysis" },
      {
        property: "og:description",
        content: "Road safety precautions and guidance for accident-prone areas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SafetyPage,
});

const precautions = [
  "Follow posted speed limits, and reduce speed further in rain, fog or low light.",
  "Wear a helmet on two-wheelers and a seat belt in every seat of a car.",
  "Keep a safe following distance, particularly on roads with repeated collision records.",
  "Never use a phone while driving; pull over if a call cannot wait.",
  "Do not drive after drinking or when fatigued, and check blind spots before changing lanes.",
];

const recommendations = [
  "Plan longer trips outside peak traffic hours when possible.",
  "Prefer well-lit, signalled crossings as a pedestrian, even if the detour is longer.",
  "Service brakes, tyres and lights regularly — vehicle condition affects stopping distance.",
  "Report broken signals, missing signage or damaged road surfaces to local authorities.",
  "Allow extra time near busy junctions and roads highlighted by the analysis.",
];

function SafetyPage() {
  const topSpots = hotspots(accidents)
    .filter((s) => s.count >= HIGH_RISK_THRESHOLD)
    .slice(0, 5);

  return (
    <Page>
      <PageHeader
        title="Safety Information"
        description="Practical guidance to interpret historical accident patterns with appropriate caution."
      />

      <div className="space-y-5">
        <p className="border-border bg-muted/40 rounded-lg border px-4 py-3 text-sm leading-relaxed">
          Use the map and charts to understand where recorded accidents are concentrated. Treat these
          patterns as context for safer decisions, not as predictions of future conditions.
        </p>

        <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Everyday road-safety precautions" description="Useful on every journey">
          <ul className="space-y-3 text-sm">
            {precautions.map((p) => (
              <li key={p} className="flex gap-3">
                <span className="bg-primary mt-2 size-1.5 shrink-0 rounded-full" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Basic safety recommendations" description="When planning and reporting journeys">
          <ul className="space-y-3 text-sm">
            {recommendations.map((r) => (
              <li key={r} className="flex gap-3">
                <span className="bg-primary mt-2 size-1.5 shrink-0 rounded-full" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Panel>
        </div>

        <Panel
          title="Accident-prone areas in this dataset"
          description="Areas where recorded accidents are most concentrated"
        >
          <ul className="divide-border divide-y text-sm">
            {topSpots.map((s, i) => (
              <li key={i} className="flex items-center justify-between gap-4 py-3 first:pt-0">
                <span>{s.location}</span>
                <span className="text-muted-foreground font-mono text-xs">
                  {s.count} accidents
                </span>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground mt-4 text-xs">
            A higher historical count supports extra awareness, but does not establish current risk
            or guarantee that other areas are safer.
          </p>
        </Panel>

        <p className="text-muted-foreground border-border border-t pt-4 text-xs leading-relaxed">
          Note: this application summarises historical accident records for study purposes. It
          cannot predict accidents, guarantee prevention, or certify that any route or area is
          safe.
        </p>
      </div>
    </Page>
  );
}
