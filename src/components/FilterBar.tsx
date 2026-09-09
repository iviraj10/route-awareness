import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
    <div className="border-border bg-surface shadow-card rounded-lg border p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
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
        <Button variant="ghost" onClick={reset} disabled={count === 0} className="sm:mb-0.5">
          Reset
        </Button>
      </div>
    </div>
  );
}
