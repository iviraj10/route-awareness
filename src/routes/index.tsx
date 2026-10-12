import { createFileRoute } from "@tanstack/react-router";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Page, PageHeader } from "@/components/AppShell";
import { FilterBar } from "@/components/FilterBar";
import { Panel, StatCard } from "@/components/StatCard";
import { byYearSeries, HIGH_RISK_THRESHOLD, summary } from "@/lib/accident-analytics";
import { useFilters } from "@/lib/filter-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Accident Patterns Dashboard — RoadSense" },
      {
        name: "description",
        content:
          "Overview of road accident statistics, yearly trends and accident hotspot locations.",
      },
      { property: "og:title", content: "Accident Patterns Dashboard — RoadSense" },
      {
        property: "og:description",
        content: "Road accident statistics, yearly trends and hotspot locations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { filtered, filteredIgnoringYear, filters } = useFilters();
  const stats = summary(filtered);
  const trend = byYearSeries(filteredIgnoringYear);

  return (
    <Page>
      <PageHeader
        title="Mumbai Accident Patterns"
        description="See where accidents are concentrated, how frequently they occur, and which patterns emerge across the recorded data."
      />

      <section
        aria-labelledby="intro-title"
        className="border-border bg-surface mb-5 rounded-lg border border-l-2 border-l-primary px-4 py-3.5 sm:px-5"
      >
        <h2 id="intro-title" className="text-sm font-semibold">Understand Mumbai's Accident Patterns</h2>
        <p className="text-muted-foreground mt-1 max-w-3xl text-sm leading-relaxed">
          Explore historical road accident records across Mumbai, identify accident-prone locations, and understand
          patterns by year, accident type, and severity.
        </p>
      </section>

      <div className="space-y-5">
        <FilterBar />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total accidents"
          value={stats.total}
          detail="Accident records in the current selection"
        />
        <StatCard
          label="High-risk locations"
          value={stats.highRisk}
          detail={`Locations with ${HIGH_RISK_THRESHOLD}+ records · project-defined threshold`}
        />
        <StatCard
          label="Most common type"
          value={stats.commonType}
          detail={`Most frequent accident category · ${stats.commonTypeCount} records`}
        />
        <StatCard
          label="Most affected year"
          value={stats.worstYear}
          detail={`Year with the most recorded accidents · ${stats.worstYearCount} records`}
        />
        </div>
      </div>

      <div className="mt-5">
        <Panel
          title="Accident Trend, 2019–2026"
          description={
            filters.year === "all"
              ? "Compare annual accident frequency across the complete eight-year dataset"
              : `All eight years remain visible for comparison · ${filters.year} highlighted`
          }
        >
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="year"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: "Year", position: "insideBottom", offset: -2 }}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  label={{ value: "Accident records", angle: -90, position: "insideLeft", offset: 18 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Accidents"
                  isAnimationActive={false}
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, payload, index } = props;
                    const active = payload.year === filters.year;
                    return (
                      <circle
                        key={index}
                        cx={cx}
                        cy={cy}
                        r={active ? 6 : 3}
                        fill={active ? "var(--color-chart-1)" : "var(--color-surface)"}
                        stroke="var(--color-chart-1)"
                        strokeWidth={2}
                      />
                    );
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </Page>
  );
}
