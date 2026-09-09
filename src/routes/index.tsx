import { createFileRoute, Link } from "@tanstack/react-router";
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
import { MapPanel } from "@/components/MapPanel";
import { Panel, StatCard } from "@/components/StatCard";
import { byYearSeries, summary } from "@/lib/accident-analytics";
import { useFilters } from "@/lib/filter-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Road Accident Hotspot Analysis" },
      {
        name: "description",
        content:
          "Overview of road accident statistics, yearly trends and accident hotspot locations.",
      },
      { property: "og:title", content: "Dashboard — Road Accident Hotspot Analysis" },
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
  const { filtered } = useFilters();
  const stats = summary(filtered);
  const trend = byYearSeries(filtered);

  return (
    <Page>
      <PageHeader
        title="Dashboard"
        description="A focused overview of accident frequency, severity and location patterns."
      />

      <div className="space-y-5">
        <FilterBar />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total accidents"
          value={stats.total}
          detail={`${stats.fatal} recorded as fatal`}
        />
        <StatCard
          label="High-risk locations"
          value={stats.highRisk}
          detail="Areas with dense accident clusters"
        />
        <StatCard
          label="Most common type"
          value={stats.commonType}
          detail={`${stats.commonTypeCount} cases`}
        />
        <StatCard
          label="Most affected year"
          value={stats.worstYear}
          detail={`${stats.worstYearCount} accidents`}
        />
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <Panel
          title="Accident trend by year"
          description={`${filtered.length} matching record${filtered.length === 1 ? "" : "s"} across the selected years`}
        >
          <div className="h-56 sm:h-60">
            {filtered.length === 0 ? (
              <p className="text-muted-foreground flex h-full items-center justify-center text-sm">
                No accidents match the current filters.
              </p>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="year"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
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
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel
          title="Hotspot map preview"
          description="Accident locations and concentration areas"
          action={
            <Link to="/map" className="text-primary text-xs font-medium hover:underline">
              Open full map →
            </Link>
          }
        >
          <MapPanel records={filtered} height="320px" interactive={false} zoom={10} />
        </Panel>
      </div>
    </Page>
  );
}
