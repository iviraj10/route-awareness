import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { csvFilename, downloadCsv } from "@/lib/csv-export";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Page, PageHeader } from "@/components/AppShell";
import { FilterBar } from "@/components/FilterBar";
import { Panel } from "@/components/StatCard";
import {
  bySeries,
  byYearSeries,
  roadKey,
  severityColor,
  type Filters,
} from "@/lib/accident-analytics";
import { useFilters } from "@/lib/filter-context";
import { accidents, DATASET_YEARS, type Severity } from "@/data/accidents";
import { HIGH_RISK_THRESHOLD } from "@/lib/accident-analytics";

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      { title: "Accident Pattern Analysis — RoadSense" },
      {
        name: "description",
        content:
          "Charts of accidents by year, accident type, road location and severity, updated by the active filters.",
      },
      { property: "og:title", content: "Accident Pattern Analysis — RoadSense" },
      {
        property: "og:description",
        content: "Accident patterns by year, type, road and severity.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalysisPage,
});

const axis = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
} as const;

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid var(--color-border)",
  fontSize: 12,
  boxShadow: "var(--shadow-card)",
} as const;

function EmptyState() {
  return (
    <p className="text-muted-foreground py-16 text-center text-sm">
      No accidents match the current filters.
    </p>
  );
}

function AnalysisPage() {
  const { filtered, filters } = useFilters();
  const isEmpty = filtered.length === 0;
  const [exportMsg, setExportMsg] = useState("");
  useEffect(() => setExportMsg(""), [filtered]);

  const locationData = bySeries(filtered, (a) => a.location, 10);
  const typeData = bySeries(filtered, (a) => a.accidentType);
  const roadData = bySeries(filtered, roadKey, 8);
  const severityData = bySeries(filtered, (a) => a.severity);
  const yearInSelection = byYearSeries(filtered);
  const topYear = [...yearInSelection].sort((a, b) => b.count - a.count)[0];
  const topType = typeData[0];
  const topRoad = roadData[0];
  const topSeverity = severityData[0];
  const pct = (n: number) => (filtered.length ? Math.round((n / filtered.length) * 100) : 0);
  const plural = (n: number) => `${n} recorded accident${n === 1 ? "" : "s"}`;

  const findings = [
    { label: "Peak accident year", value: topYear?.year ?? "—", detail: plural(topYear?.count ?? 0) },
    { label: "Highest accident location / road", value: topRoad?.name ?? "—", detail: plural(topRoad?.count ?? 0) },
    { label: "Most common accident type", value: topType?.name ?? "—", detail: `${plural(topType?.count ?? 0)} · ${pct(topType?.count ?? 0)}%` },
    {
      label: "Largest severity category",
      value: topSeverity?.name ?? "—",
      detail: `${plural(topSeverity?.count ?? 0)} · ${pct(topSeverity?.count ?? 0)}%`,
    },
  ];

  const insight =
    topYear && topRoad && topType && topSeverity
      ? `Across ${filtered.length === 1 ? "the 1 selected record" : `the ${filtered.length} selected records`}, ${filters.year !== "all" ? "all accidents fall in" : "accident frequency peaks in"} ${topYear.year} (${topYear.count}), and the highest concentration is recorded at ${topRoad.name} (${topRoad.count}). ${topType.name} is the most common accident type at ${pct(topType.count)}% of records, while ${topSeverity.name.toLowerCase()} accidents form the largest severity group (${pct(topSeverity.count)}%).`
      : "";

  return (
    <Page>
      <PageHeader
        title="Accident Pattern Analysis"
        description={`Interpret trends, locations and severity across ${filtered.length} accident record${
          filtered.length === 1 ? "" : "s"
        } matching the current filters.`}
      />
      <div className="space-y-5">
        <FilterBar />
        <div className="flex flex-wrap items-center justify-end gap-3">
          <p className="text-muted-foreground text-xs" role="status" aria-live="polite">
            {isEmpty ? "No records to export for this selection." : exportMsg}
          </p>
          <Button
            variant="outline"
            size="sm"
            disabled={isEmpty}
            aria-label={`Export ${filtered.length} filtered accident records as CSV`}
            onClick={() => {
              const name = csvFilename(filters.year);
              downloadCsv(filtered, name);
              setExportMsg(`Download started: ${name} (${filtered.length} records)`);
            }}
          >
            <Download className="size-3.5" />
            Export CSV
          </Button>
        </div>

        <section
          className="border-border bg-surface shadow-card rounded-lg border px-4 py-5 sm:px-6"
          aria-labelledby="key-findings-title"
        >
          <div className="mb-4">
            <h2 id="key-findings-title" className="text-base font-semibold">Key Findings</h2>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Recalculated from {filtered.length} record{filtered.length === 1 ? "" : "s"} in the current selection
            </p>
          </div>
          {isEmpty ? (
            <p className="text-muted-foreground py-4 text-sm">No findings are available for this selection.</p>
          ) : (
            <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
              {findings.map((f) => (
                <div key={f.label} className="border-primary/30 border-l-2 pl-3">
                  <dd className="text-lg leading-snug font-semibold">{f.value}</dd>
                  <dt className="text-foreground mt-0.5 text-xs font-medium">{f.label}</dt>
                  <dd className="text-muted-foreground mt-1 font-mono text-xs">{f.detail}</dd>
                </div>
              ))}
            </dl>
          )}
          {!isEmpty && (
            <div className="border-border mt-5 border-t pt-4" aria-labelledby="data-shows-title">
              <h3 id="data-shows-title" className="text-sm font-semibold">What the data shows</h3>
              <p className="text-muted-foreground mt-1 max-w-3xl text-sm leading-relaxed">{insight}</p>
            </div>
          )}
        </section>

        <Panel title="Accident Concentration by Location" description="Top accident locations within the currently selected dataset">
          <div style={{ height: Math.max(locationData.length * 34 + 56, 160) }}>
            {isEmpty ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationData} layout="vertical" margin={{ top: 4, right: 40, left: 8, bottom: 16 }}>
                  <CartesianGrid stroke="var(--color-border)" horizontal={false} />
                  <XAxis type="number" {...axis} allowDecimals={false} label={{ value: "Accident records", position: "insideBottom", offset: -2 }} />
                  <YAxis type="category" dataKey="name" width={110} {...axis} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-muted)" }} />
                  <Bar dataKey="count" name="Accident records" isAnimationActive={false} fill="var(--color-chart-2)" radius={[0, 4, 4, 0]} barSize={16}>
                    <LabelList dataKey="count" position="right" fontSize={12} fill="var(--color-foreground)" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel title="Accident Type Analysis" description="Compare the frequency of each recorded collision category">
          <div className="h-72">
            {isEmpty ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={typeData}
                  layout="vertical"
                  margin={{ top: 4, right: 24, left: 8, bottom: 16 }}
                >
                  <CartesianGrid stroke="var(--color-border)" horizontal={false} />
                   <XAxis type="number" {...axis} allowDecimals={false} label={{ value: "Accident records", position: "insideBottom", offset: -2 }} />
                  <YAxis type="category" dataKey="name" width={150} {...axis} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-muted)" }} />
                  <Bar
                    dataKey="count"
                    name="Accidents"
                    isAnimationActive={false}
                    fill="var(--color-chart-1)"
                    radius={[0, 4, 4, 0]}
                    barSize={16}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel title="Location and Road Analysis" description="Identify the Mumbai locations and roads with the highest recorded frequency">
          <div className="h-80 sm:h-88">
            {isEmpty ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={roadData}
                  layout="vertical"
                  margin={{ top: 4, right: 24, left: 8, bottom: 16 }}
                >
                  <CartesianGrid stroke="var(--color-border)" horizontal={false} />
                   <XAxis type="number" {...axis} allowDecimals={false} label={{ value: "Accident records", position: "insideBottom", offset: -2 }} />
                   <YAxis type="category" dataKey="name" width={180} {...axis} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-muted)" }} />
                  <Bar
                    dataKey="count"
                    name="Accidents"
                    isAnimationActive={false}
                    fill="var(--color-chart-4)"
                    radius={[0, 4, 4, 0]}
                    barSize={14}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel title="Severity Analysis" description="Compare fatal, serious and minor accident records in the current selection">
          <div className="h-64 sm:h-72">
            {isEmpty ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData} margin={{ top: 8, right: 12, left: 4, bottom: 16 }}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" {...axis} />
                   <YAxis {...axis} allowDecimals={false} label={{ value: "Accident records", angle: -90, position: "insideLeft", offset: 4 }} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-muted)" }} />
                  <Bar dataKey="count" name="Accidents" isAnimationActive={false} radius={[4, 4, 0, 0]} barSize={56}>
                    {severityData.map((row) => (
                      <Cell key={row.name} fill={severityColor[row.name as Severity]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>
        <section
          className="border-border bg-surface shadow-card rounded-lg border px-4 py-5 sm:px-6"
          aria-labelledby="methodology-title"
        >
          <h2 id="methodology-title" className="text-base font-semibold">Methodology &amp; Dataset</h2>
          <p className="text-muted-foreground mt-0.5 text-xs">How the accident patterns on this page are derived</p>
          <dl className="mt-4 grid gap-x-8 gap-y-5 text-sm md:grid-cols-2">
            <div>
              <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Dataset</dt>
              <dd className="mt-1 leading-relaxed">
                {accidents.length} Mumbai-only accident records covering {DATASET_YEARS[0]}–{DATASET_YEARS[DATASET_YEARS.length - 1]}.
                This is a study/demo dataset prepared for the project — it is not live or official government data.
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Analysis parameters</dt>
              <dd className="mt-1 leading-relaxed">
                Each record is analysed by Year, Location, Road, Accident Type and Severity. The filters above narrow every finding and chart on this page.
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Hotspot method</dt>
              <dd className="mt-1 leading-relaxed">
                Accident coordinates are grouped by geographic proximity. Areas with a higher concentration of recorded accidents are shown as hotspots. This describes past records only and does not predict future accidents.
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">High-risk location</dt>
              <dd className="mt-1 leading-relaxed">
                A location with {HIGH_RISK_THRESHOLD} or more recorded accident cases is classified as a High-Risk Location for this study. This is a project-defined threshold, not an official government classification.
              </dd>
            </div>
          </dl>
          <div className="border-border mt-5 border-t pt-4">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Purpose</p>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed">
              The analysis is intended to identify historical accident patterns, concentration areas, and severity trends to support awareness and data-driven discussion.
            </p>
          </div>
        </section>
      </div>
    </Page>
  );
}
