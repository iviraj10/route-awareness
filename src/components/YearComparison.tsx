import { reducedMotion } from "@/lib/reduced-motion";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { accidents, DATASET_YEARS } from "@/data/accidents";
import { activeFilterCount } from "@/lib/accident-analytics";
import { useFilters } from "@/lib/filter-context";
import { compareYears, comparisonInsights, diffLabel, pctChange } from "@/lib/year-comparison";

const axis = { stroke: "var(--color-muted-foreground)", fontSize: 12, tickLine: false, axisLine: false } as const;
const tooltipStyle = { borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 } as const;
const COLOR_A = "var(--color-chart-2)";
const COLOR_B = "var(--color-chart-4)";

const years = [...new Set(accidents.map((a) => a.year))].sort((a, b) => a - b);
const fallbackYears = years.length ? years : [...DATASET_YEARS];

function YearSelect({ label, value, other, onChange }: { label: string; value: number; other: number; onChange: (y: number) => void }) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</span>
      <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
        <SelectTrigger className="bg-surface w-full" aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[...fallbackYears].reverse().map((y) => (
            <SelectItem key={y} value={String(y)} disabled={y === other}>
              {y}
              {y === other ? " (selected in other)" : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

function CompareCard({ title, yearA, yearB, a, b, change }: { title: string; yearA: number; yearB: number; a: string; b: string; change?: { diff: string; pct: string } }) {
  return (
    <div className="rs-lift border-border rounded-lg border p-4">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{title}</p>
      <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div><dt className="text-muted-foreground text-xs">{yearA}</dt><dd className="font-mono font-semibold break-words">{a}</dd></div>
        <div><dt className="text-muted-foreground text-xs">{yearB}</dt><dd className="font-mono font-semibold break-words">{b}</dd></div>
      </dl>
      {change && (
        <p className="text-muted-foreground border-border mt-3 border-t pt-2 text-xs">
          Difference: <span className="text-foreground font-mono">{change.diff}</span> · Change: <span className="text-foreground font-mono">{change.pct}</span>
        </p>
      )}
    </div>
  );
}

export function YearComparison() {
  const { filters, filteredIgnoringYear } = useFilters();
  const [yearA, setYearA] = useState<number>(fallbackYears[fallbackYears.length - 2] ?? fallbackYears[0] ?? 0);
  const [yearB, setYearB] = useState<number>(fallbackYears[fallbackYears.length - 1] ?? 0);
  const [useAll, setUseAll] = useState(false);

  const otherFilters = activeFilterCount({ ...filters, year: "all" });
  const records = useAll ? accidents : filteredIgnoringYear;

  const header = (
    <div>
      <h2 id="yoy-title" className="text-base font-semibold">Year-over-Year Comparison</h2>
      <p className="text-muted-foreground mt-0.5 text-xs">Compare accident patterns across two selected years using the available study dataset.</p>
    </div>
  );

  if (fallbackYears.length < 2) {
    return (
      <section className="border-border bg-surface shadow-card rounded-lg border px-4 py-5 sm:px-6" aria-labelledby="yoy-title">
        {header}
        <p className="text-muted-foreground mt-4 text-sm">At least two years of records are needed for a comparison.</p>
      </section>
    );
  }

  const c = compareYears(records, yearA, yearB);
  const insights = comparisonInsights(c, yearA, yearB);
  const top = (t: { name: string; count: number } | null) => (t ? `${t.name} (${t.count})` : "—");
  const severityData = c.severity.map((s) => ({ name: s.name, [yearA]: s.a, [yearB]: s.b }));
  const typeData = c.types.map((t) => ({ name: t.name, [yearA]: t.a, [yearB]: t.b }));
  const empty = c.a.total === 0 && c.b.total === 0;

  return (
    <section className="border-border bg-surface shadow-card space-y-5 rounded-lg border px-4 py-5 sm:px-6" aria-labelledby="yoy-title">
      {header}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <YearSelect label="Compare Year A" value={yearA} other={yearB} onChange={setYearA} />
        <YearSelect label="Compare Year B" value={yearB} other={yearA} onChange={setYearB} />
      </div>

      <div className="bg-muted text-muted-foreground flex flex-wrap items-center justify-between gap-2 rounded-md px-3 py-2 text-xs" role="status">
        <span>
          {useAll || otherFilters === 0
            ? "Comparing all accident records for the two selected years."
            : `Comparing the filtered subset (${otherFilters} road/type/severity filter${otherFilters === 1 ? "" : "s"}). The global Year filter is not used here.`}
        </span>
        {otherFilters > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setUseAll((v) => !v)}>
            {useAll ? "Apply current filters" : "Compare all records"}
          </Button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <CompareCard title="Total accidents" yearA={yearA} yearB={yearB} a={String(c.a.total)} b={String(c.b.total)} change={{ diff: diffLabel(c.a.total, c.b.total), pct: pctChange(c.a.total, c.b.total) }} />
        <CompareCard title="Fatal accidents" yearA={yearA} yearB={yearB} a={String(c.a.fatal)} b={String(c.b.fatal)} change={{ diff: diffLabel(c.a.fatal, c.b.fatal), pct: pctChange(c.a.fatal, c.b.fatal) }} />
        <CompareCard title="Most common accident type" yearA={yearA} yearB={yearB} a={top(c.a.type)} b={top(c.b.type)} />
        <CompareCard title="Most affected location" yearA={yearA} yearB={yearB} a={top(c.a.location)} b={top(c.b.location)} />
      </div>

      {empty ? (
        <p className="text-muted-foreground py-8 text-center text-sm">No accidents match the current filters for either selected year.</p>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold">Accident Severity Comparison</h3>
            <div className="mt-2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" {...axis} />
                  <YAxis {...axis} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-muted)" }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey={String(yearA)} name={`${yearA}`} fill={COLOR_A} isAnimationActive={!reducedMotion} animationDuration={350} radius={[4, 4, 0, 0]} />
                  <Bar dataKey={String(yearB)} name={`${yearB}`} fill={COLOR_B} isAnimationActive={!reducedMotion} animationDuration={350} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Accident Type Comparison (top 5)</h3>
            <div className="mt-2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData} layout="vertical" margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-border)" horizontal={false} />
                  <XAxis type="number" {...axis} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={120} {...axis} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-muted)" }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey={String(yearA)} name={`${yearA}`} fill={COLOR_A} isAnimationActive={!reducedMotion} animationDuration={350} barSize={9} />
                  <Bar dataKey={String(yearB)} name={`${yearB}`} fill={COLOR_B} isAnimationActive={!reducedMotion} animationDuration={350} barSize={9} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <div className="border-border border-t pt-4">
        <h3 className="text-sm font-semibold">Comparison Insights</h3>
        {insights.length ? (
          <ul className="text-muted-foreground mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed">
            {insights.map((s) => <li key={s}>{s}</li>)}
          </ul>
        ) : (
          <p className="text-muted-foreground mt-1 text-sm">No records are available to compare.</p>
        )}
        <p className="text-muted-foreground mt-2 text-xs">
          These observations describe recorded counts only and do not explain why accidents changed. Based on a study/demo dataset, not live or verified official government data.
        </p>
      </div>
    </section>
  );
}
