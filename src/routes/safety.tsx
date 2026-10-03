import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader } from "@/components/AppShell";
import { Panel } from "@/components/StatCard";
import { accidents } from "@/data/accidents";
import { highRiskLocations } from "@/lib/accident-analytics";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Road Safety Awareness — RoadSense" },
      {
        name: "description",
        content:
          "Road safety precautions, guidance for accident-prone areas and general recommendations for drivers and pedestrians.",
      },
      { property: "og:title", content: "Road Safety Awareness — RoadSense" },
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

const driverPrecautions = [
  "Follow posted speed limits, and reduce speed further in rain, fog or low light.",
  "Wear a helmet on two-wheelers and a seat belt in every seat of a car.",
  "Keep a safe following distance, particularly on roads with repeated collision records.",
  "Never use a phone while driving; pull over if a call cannot wait.",
  "Do not drive after drinking or when fatigued, and check blind spots before changing lanes.",
];

const recommendations = [
  "Plan longer trips outside peak traffic hours when possible.",
  "Service brakes, tyres and lights regularly — vehicle condition affects stopping distance.",
  "Report broken signals, missing signage or damaged road surfaces to local authorities.",
  "Allow extra time near busy junctions and roads highlighted by the analysis.",
];

const pedestrianSafety = [
  "Use well-lit, signalled crossings even when the route is slightly longer.",
  "Make eye contact with approaching drivers before stepping into a crossing.",
  "Stay visible at night and avoid phone use while crossing busy roads.",
  "Allow extra distance around buses, trucks and vehicles with limited visibility.",
];

function SafetyPage() {
  const topSpots = highRiskLocations(accidents).slice(0, 5);

  return (
    <Page>
      <PageHeader
        title="Road Safety Awareness"
        description="Use historical accident patterns to support awareness around Mumbai roads and high-risk locations."
      />

      <div className="space-y-5">
        <section className="border-border bg-muted/40 rounded-lg border px-4 py-3" aria-labelledby="general-safety-title">
          <h2 id="general-safety-title" className="text-sm font-semibold">General Road Safety</h2>
          <p className="mt-1 text-sm leading-relaxed">
            Use the map and analysis to understand where recorded accidents are concentrated. Treat
            these patterns as context for awareness, not as predictions of future conditions.
          </p>
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Driver Precautions" description="Practical habits for every journey">
          <ul className="space-y-3 text-sm">
            {driverPrecautions.map((p) => (
              <li key={p} className="flex gap-3">
                <span className="bg-primary mt-2 size-1.5 shrink-0 rounded-full" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Pedestrian Safety" description="Extra care around busy roads and crossings">
          <ul className="space-y-3 text-sm">
            {pedestrianSafety.map((r) => (
              <li key={r} className="flex gap-3">
                <span className="bg-primary mt-2 size-1.5 shrink-0 rounded-full" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Panel>
        </div>

        <Panel
           title="High-Risk Area Awareness"
           description="Mumbai locations meeting the dataset’s accident-concentration threshold"
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
          <div className="border-border mt-4 border-t pt-4">
            <h3 className="text-sm font-semibold">Around highlighted areas</h3>
            <ul className="text-muted-foreground mt-2 grid gap-2 text-xs sm:grid-cols-2">
              {recommendations.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </div>
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
