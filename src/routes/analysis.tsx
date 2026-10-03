import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
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
import type { Severity } from "@/data/accidents";

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
  const { filtered, filteredIgnoringYear, filters } = useFilters();
  const isEmpty = filtered.length === 0;

  const yearData = byYearSeries(filteredIgnoringYear);
  const typeData = bySeries(filtered, (a) => a.accidentType);
  const roadData = bySeries(filtered, roadKey, 8);
  const severityData = bySeries(filtered, (a) => a.severity);
  const topYear = [...yearData].sort((a, b) => b.count - a.count)[0];
  const topType = typeData[0];
  const topRoad = roadData[0];
  const severityFindings = severityData.map((row) => ({
    ...row,
    percentage: filtered.length ? Math.round((row.count / filtered.length) * 100) : 0,
  }));

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

        <section className="border-border bg-surface shadow-card rounded-lg border px-4 py-4 sm:px-5" aria-labelledby="key-findings-title">
          <div className="mb-3">
            <h2 id="key-findings-title" className="text-base font-semibold">Key Findings</h2>
            <p className="text-muted-foreground mt-0.5 text-xs">Calculated from the current filters</p>
          </div>
          {isEmpty ? (
            <p className="text-muted-foreground py-4 text-sm">No findings are available for this selection.</p>
          ) : (
            <dl className="grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div className="border-border border-l-2 pl-3">
                <dt className="text-muted-foreground text-xs">Peak year</dt>
                <dd className="mt-1 font-semibold">{topYear?.year ?? "—"} · {topYear?.count ?? 0} records</dd>
              </div>
              <div className="border-border border-l-2 pl-3">
                <dt className="text-muted-foreground text-xs">Leading accident type</dt>
                <dd className="mt-1 font-semibold">{topType?.name ?? "—"} · {topType?.count ?? 0}</dd>
              </div>
              <div className="border-border border-l-2 pl-3">
                <dt className="text-muted-foreground text-xs">Highest-count location / road</dt>
                <dd className="mt-1 font-semibold leading-snug">{topRoad?.name ?? "—"} · {topRoad?.count ?? 0}</dd>
              </div>
              <div className="border-border border-l-2 pl-3">
                <dt className="text-muted-foreground text-xs">Severity distribution</dt>
                <dd className="mt-1 font-semibold leading-snug">
                  {severityFindings.map((row) => `${row.name} ${row.percentage}%`).join(" · ") || "—"}
                </dd>
              </div>
            </dl>
          )}
        </section>

        <Panel title="Accident Trend by Year" description={`Annual accident records · ${describe(filters)}`}>
          <div className="h-64 sm:h-72">
            {filteredIgnoringYear.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearData} margin={{ top: 8, right: 12, left: -16 }}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="year" {...axis} label={{ value: "Year", position: "insideBottom", offset: -2 }} />
                  <YAxis {...axis} allowDecimals={false} label={{ value: "Records", angle: -90, position: "insideLeft", offset: 18 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Accidents"
                    isAnimationActive={false}
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
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
                  margin={{ top: 4, right: 24, left: 8 }}
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
                  margin={{ top: 4, right: 24, left: 8 }}
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
                <BarChart data={severityData} margin={{ top: 8, right: 12, left: -16 }}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" {...axis} />
                   <YAxis {...axis} allowDecimals={false} label={{ value: "Accident records", angle: -90, position: "insideLeft", offset: 18 }} />
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
      </div>
    </Page>
  );
}

function describe(f: Filters) {
  const parts = [
    f.road !== "all" ? f.road : null,
    f.accidentType !== "all" ? f.accidentType : null,
    f.severity !== "all" ? `${f.severity} severity` : null,
    f.year !== "all" ? f.year : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "Whole dataset";
}
