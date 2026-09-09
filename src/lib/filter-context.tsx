import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { accidents } from "@/data/accidents";
import { applyFilters, emptyFilters, type Filters } from "@/lib/accident-analytics";

interface FilterContextValue {
  filters: Filters;
  setFilter: (key: keyof Filters, value: string) => void;
  reset: () => void;
  filtered: ReturnType<typeof applyFilters>;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  const value = useMemo<FilterContextValue>(
    () => ({
      filters,
      setFilter: (key, v) => setFilters((prev) => ({ ...prev, [key]: v })),
      reset: () => setFilters(emptyFilters),
      filtered: applyFilters(accidents, filters),
    }),
    [filters],
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used inside FilterProvider");
  return ctx;
}
