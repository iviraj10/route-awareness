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
    ],
  }),
  component: SafetyPage,
});

const precautions = [
  "Follow posted speed limits, and reduce speed further in rain, fog or low light.",
  "Wear a helmet on two-wheelers and a seat belt in every seat of a car.",
  "Keep a safe following distance — rear-end collisions are among the most frequent types in this dataset.",
  "Never use a phone while driving; pull over if a call cannot wait.",
  "Do not drive after drinking or when heavily fatigued.",
  "Use indicators early and check blind spots before changing lanes.",
];

const recommendations = [
  "Plan longer trips outside peak traffic hours when possible.",
  "Prefer well-lit, signalled crossings as a pedestrian, even if the detour is longer.",
  "Service brakes, tyres and lights regularly — vehicle condition affects stopping distance.",
  "Report broken signals, missing signage or damaged road surfaces to local authorities.",
  "Share trip details with someone when travelling long distances at night.",
];

function SafetyPage() {
  const topSpots = hotspots(accidents)
    .filter((s) => s.count >= HIGH_RISK_THRESHOLD)
    .slice(0, 5);

  return (
    <Page>
      <PageHeader
        title="Safety Information"
        description="General guidance based on common accident patterns in the dataset."
      />

      <div className="space-y-8">
        <Panel title="General road-safety precautions">
          <ul className="space-y-3 text-sm">
            {precautions.map((p) => (
              <li key={p} className="flex gap-3">
                <span className="bg-primary mt-2 size-1.5 shrink-0 rounded-full" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </Panel>

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
            Extra caution is advisable near these areas, especially at junctions and during
            night-time hours.
          </p>
        </Panel>

        <Panel title="Basic safety recommendations">
          <ul className="space-y-3 text-sm">
            {recommendations.map((r) => (
              <li key={r} className="flex gap-3">
                <span className="bg-primary mt-2 size-1.5 shrink-0 rounded-full" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <p className="text-muted-foreground border-border bg-muted/40 rounded-lg border p-4 text-xs">
          Note: this application summarises historical accident records for study purposes. It
          cannot predict accidents, guarantee prevention, or certify that any route or area is
          safe.
        </p>
      </div>
    </Page>
  );
}
