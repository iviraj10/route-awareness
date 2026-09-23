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
      { title: "Analysis — Road Accident Hotspot Analysis" },
      {
        name: "description",
        content:
          "Charts of accidents by year, accident type, road location and severity, updated by the active filters.",
      },
      { property: "og:title", content: "Analysis — Road Accident Hotspot Analysis" },
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

  return (
    <Page>
      <PageHeader
        title="Analysis"
        description={`Charts are calculated from ${filtered.length} accident record${
          filtered.length === 1 ? "" : "s"
        } matching the current filters.`}
      />
      <div className="space-y-5">
        <FilterBar />

        <Panel title="Accidents by year" description={describe(filters)}>
          <div className="h-60">
            {filteredIgnoringYear.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearData} margin={{ top: 8, right: 12, left: -16 }}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="year" {...axis} />
                  <YAxis {...axis} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Accidents"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel title="Accidents by accident type" description="Frequency of each collision category">
          <div className="h-68">
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
                  <XAxis type="number" {...axis} />
                  <YAxis type="category" dataKey="name" width={150} {...axis} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-muted)" }} />
                  <Bar
                    dataKey="count"
                    name="Accidents"
                    fill="var(--color-chart-1)"
                    radius={[0, 4, 4, 0]}
                    barSize={16}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel title="Accidents by location / road" description="Highest-frequency roads in the current selection">
          <div className="h-76">
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
                  <XAxis type="number" {...axis} />
                  <YAxis type="category" dataKey="name" width={220} {...axis} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-muted)" }} />
                  <Bar
                    dataKey="count"
                    name="Accidents"
                    fill="var(--color-chart-4)"
                    radius={[0, 4, 4, 0]}
                    barSize={14}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel title="Accidents by severity" description="Fatal, serious and minor records compared">
          <div className="h-60">
            {isEmpty ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData} margin={{ top: 8, right: 12, left: -16 }}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" {...axis} />
                  <YAxis {...axis} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-muted)" }} />
                  <Bar dataKey="count" name="Accidents" radius={[4, 4, 0, 0]} barSize={56}>
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
