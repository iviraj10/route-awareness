import type { AccidentRecord, Severity } from "@/data/accidents";

const SEVERITIES: Severity[] = ["Fatal", "Serious", "Minor"];

/** Percentage change from A to B, one decimal, with safe edge cases. */
export function pctChange(a: number, b: number): string {
  if (a === 0 && b === 0) return "No change";
  if (a === 0) return "N/A — no baseline records";
  if (b === 0) return "−100%";
  const p = ((b - a) / a) * 100;
  if (p === 0) return "No change";
  return `${p > 0 ? "+" : "−"}${Math.abs(p).toFixed(1)}%`;
}

export function diffLabel(a: number, b: number): string {
  const d = b - a;
  return d === 0 ? "0" : `${d > 0 ? "+" : "−"}${Math.abs(d)}`;
}

function countBy(records: AccidentRecord[], key: (a: AccidentRecord) => string) {
  const m = new Map<string, number>();
  for (const r of records) m.set(key(r), (m.get(key(r)) ?? 0) + 1);
  return m;
}

/** Highest count; ties broken alphabetically so results are deterministic. */
export function topBy(records: AccidentRecord[], key: (a: AccidentRecord) => string) {
  const top = [...countBy(records, key).entries()].sort(
    (x, y) => y[1] - x[1] || x[0].localeCompare(y[0]),
  )[0];
  return top ? { name: top[0], count: top[1] } : null;
}

export function compareYears(records: AccidentRecord[], yearA: number, yearB: number) {
  const a = records.filter((r) => r.year === yearA);
  const b = records.filter((r) => r.year === yearB);
  const sevA = countBy(a, (r) => r.severity);
  const sevB = countBy(b, (r) => r.severity);
  const severity = SEVERITIES.map((s) => ({ name: s, a: sevA.get(s) ?? 0, b: sevB.get(s) ?? 0 }));

  const typeA = countBy(a, (r) => r.accidentType);
  const typeB = countBy(b, (r) => r.accidentType);
  const types = [...new Set([...typeA.keys(), ...typeB.keys()])]
    .map((name) => ({ name, a: typeA.get(name) ?? 0, b: typeB.get(name) ?? 0 }))
    .sort((x, y) => y.a + y.b - (x.a + x.b) || x.name.localeCompare(y.name))
    .slice(0, 5);

  return {
    a: { total: a.length, fatal: sevA.get("Fatal") ?? 0, type: topBy(a, (r) => r.accidentType), location: topBy(a, (r) => r.location) },
    b: { total: b.length, fatal: sevB.get("Fatal") ?? 0, type: topBy(b, (r) => r.accidentType), location: topBy(b, (r) => r.location) },
    severity,
    types,
  };
}

export type YearComparison = ReturnType<typeof compareYears>;

export function comparisonInsights(c: YearComparison, yearA: number, yearB: number): string[] {
  if (c.a.total === 0 && c.b.total === 0) return [];
  const out: string[] = [];
  if (c.a.total === c.b.total) out.push(`${yearA} and ${yearB} have the same number of recorded accidents (${c.a.total}).`);
  else {
    const [hi, lo] = c.a.total > c.b.total ? [yearA, yearB] : [yearB, yearA];
    out.push(`${hi} has more recorded accidents than ${lo} (${Math.max(c.a.total, c.b.total)} vs ${Math.min(c.a.total, c.b.total)}).`);
  }
  const sev = [...c.severity].sort((x, y) => Math.abs(y.b - y.a) - Math.abs(x.b - x.a))[0];
  if (sev.a === sev.b) out.push("Each severity category has the same count in both years.");
  else out.push(`${sev.name} accidents show the largest count difference between the years (${sev.a} in ${yearA}, ${sev.b} in ${yearB}).`);
  const loc = (y: number, l: { name: string; count: number } | null) => (l ? `${l.name} in ${y} (${l.count})` : `no location in ${y}`);
  out.push(`The highest recorded location count is ${loc(yearA, c.a.location)} and ${loc(yearB, c.b.location)}.`);
  return out;
}
