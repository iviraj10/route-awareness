import {
  accidents,
  DATASET_YEARS,
  type AccidentRecord,
  type Severity,
} from "@/data/accidents";

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

/** Minimum accidents in a map grid cell before it is drawn as a hotspot area. */
export const HOTSPOT_MIN_COUNT = 4;

/** A location counts as high-risk once it reaches this many accident records. */
export const HIGH_RISK_THRESHOLD = 8;

/** Locations (with their accident count) that meet the high-risk threshold. */
export function highRiskLocations(records: AccidentRecord[]) {
  const map = countBy(records, (a) => a.location);
  return [...map.entries()]
    .filter(([, count]) => count >= HIGH_RISK_THRESHOLD)
    .sort((a, b) => b[1] - a[1])
    .map(([location, count]) => ({ location, count }));
}

export function summary(records: AccidentRecord[]) {
  const byType = countBy(records, (a) => a.accidentType);
  const byYear = countBy(records, (a) => a.year);
  return {
    total: records.length,
    highRisk: highRiskLocations(records).length,
    commonType: topEntry(byType)?.[0] ?? "—",
    commonTypeCount: topEntry(byType)?.[1] ?? 0,
    worstYear: topEntry(byYear)?.[0] ?? "—",
    worstYearCount: topEntry(byYear)?.[1] ?? 0,
    fatal: records.filter((a) => a.severity === "Fatal").length,
  };
}

/** One point per dataset year (2019-2026), so the trend never collapses. */
export function byYearSeries(records: AccidentRecord[]) {
  const map = countBy(records, (a) => a.year);
  return DATASET_YEARS.map((year) => ({
    year: String(year),
    count: map.get(year) ?? 0,
  }));
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
