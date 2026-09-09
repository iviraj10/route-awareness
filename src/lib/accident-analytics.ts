import { accidents, type AccidentRecord, type Severity } from "@/data/accidents";

export interface Filters {
  year: string;
  road: string;
  accidentType: string;
  severity: string;
}

export const ALL = "all";

export const emptyFilters: Filters = {
  year: ALL,
  road: ALL,
  accidentType: ALL,
  severity: ALL,
};

const uniqueSorted = (values: (string | number)[]) =>
  Array.from(new Set(values.map(String))).sort();

export const filterOptions = {
  years: uniqueSorted(accidents.map((a) => a.year)).reverse(),
  roads: uniqueSorted(accidents.map((a) => `${a.location} — ${a.road}`)),
  accidentTypes: uniqueSorted(accidents.map((a) => a.accidentType)),
  severities: ["Fatal", "Serious", "Minor"] as Severity[],
};

export const roadKey = (a: AccidentRecord) => `${a.location} — ${a.road}`;

export function applyFilters(records: AccidentRecord[], f: Filters) {
  return records.filter(
    (a) =>
      (f.year === ALL || String(a.year) === f.year) &&
      (f.road === ALL || roadKey(a) === f.road) &&
      (f.accidentType === ALL || a.accidentType === f.accidentType) &&
      (f.severity === ALL || a.severity === f.severity),
  );
}

export const activeFilterCount = (f: Filters) =>
  Object.values(f).filter((v) => v !== ALL).length;

function countBy<T extends string | number>(
  records: AccidentRecord[],
  key: (a: AccidentRecord) => T,
) {
  const map = new Map<T, number>();
  for (const a of records) map.set(key(a), (map.get(key(a)) ?? 0) + 1);
  return map;
}

const topEntry = <T extends string | number>(map: Map<T, number>) =>
  [...map.entries()].sort((a, b) => b[1] - a[1])[0];

/** Groups accidents onto a coarse geographic grid to find concentrations. */
export function hotspots(records: AccidentRecord[], precision = 2) {
  const groups = new Map<
    string,
    { latitude: number; longitude: number; count: number; location: string }
  >();
  for (const a of records) {
    const key = `${a.latitude.toFixed(precision)}|${a.longitude.toFixed(precision)}`;
    const g = groups.get(key);
    if (g) {
      g.count += 1;
      g.latitude = (g.latitude * (g.count - 1) + a.latitude) / g.count;
      g.longitude = (g.longitude * (g.count - 1) + a.longitude) / g.count;
    } else {
      groups.set(key, {
        latitude: a.latitude,
        longitude: a.longitude,
        count: 1,
        location: a.location,
      });
    }
  }
  return [...groups.values()].sort((a, b) => b.count - a.count);
}

export const HIGH_RISK_THRESHOLD = 8;

export function summary(records: AccidentRecord[]) {
  const byType = countBy(records, (a) => a.accidentType);
  const byYear = countBy(records, (a) => a.year);
  const spots = hotspots(records);
  return {
    total: records.length,
    highRisk: spots.filter((s) => s.count >= HIGH_RISK_THRESHOLD).length,
    commonType: topEntry(byType)?.[0] ?? "—",
    commonTypeCount: topEntry(byType)?.[1] ?? 0,
    worstYear: topEntry(byYear)?.[0] ?? "—",
    worstYearCount: topEntry(byYear)?.[1] ?? 0,
    fatal: records.filter((a) => a.severity === "Fatal").length,
  };
}

export function byYearSeries(records: AccidentRecord[]) {
  const map = countBy(records, (a) => a.year);
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, count]) => ({ year: String(year), count }));
}

export function bySeries(
  records: AccidentRecord[],
  key: (a: AccidentRecord) => string,
  limit?: number,
) {
  const map = countBy(records, key);
  const rows = [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
  return limit ? rows.slice(0, limit) : rows;
}

export const severityColor: Record<Severity, string> = {
  Fatal: "var(--severity-fatal)",
  Serious: "var(--severity-serious)",
  Minor: "var(--severity-minor)",
};
