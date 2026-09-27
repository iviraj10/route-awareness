import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { ALL, activeFilterCount, filterOptions, type Filters } from "@/lib/accident-analytics";
import { useFilters } from "@/lib/filter-context";

function Field({
  label,
  value,
  onChange,
  allLabel,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  allLabel: string;
  options: string[];
}) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-surface w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{allLabel}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

export function FilterBar() {
  const { filters, setFilter, reset } = useFilters();
  const count = activeFilterCount(filters);
  const set = (k: keyof Filters) => (v: string) => setFilter(k, v);

  return (
    <section className="border-border bg-surface shadow-card rounded-lg border px-4 py-4" aria-label="Accident data filters">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold">Explore accident patterns</h2>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {count === 0 ? "Showing all Mumbai accident records" : `${count} active filter${count === 1 ? "" : "s"} applied across this view`}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={reset} disabled={count === 0} className="shrink-0">
          <RotateCcw className="size-3.5" />
          Reset filters
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field
          label="Year"
          value={filters.year}
          onChange={set("year")}
          allLabel="All years"
          options={filterOptions.years}
        />
        <Field
          label="Road / Location"
          value={filters.road}
          onChange={set("road")}
          allLabel="All roads"
          options={filterOptions.roads}
        />
        <Field
          label="Accident type"
          value={filters.accidentType}
          onChange={set("accidentType")}
          allLabel="All types"
          options={filterOptions.accidentTypes}
        />
        <Field
          label="Severity"
          value={filters.severity}
          onChange={set("severity")}
          allLabel="All severities"
          options={filterOptions.severities}
        />
      </div>
    </section>
  );
}
