import type { AccidentRecord } from "@/data/accidents";
import { ALL } from "@/lib/accident-analytics";

const HEADER = ["Accident ID", "Date", "Year", "Location", "Road", "Latitude", "Longitude", "Accident Type", "Severity"];

export function escapeCsv(value: string | number) {
  const s = String(value);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(records: AccidentRecord[]) {
  const rows = records.map((a) =>
    [a.id, a.date, a.year, a.location, a.road, a.latitude, a.longitude, a.accidentType, a.severity]
      .map(escapeCsv)
      .join(","),
  );
  return [HEADER.join(","), ...rows].join("\r\n");
}

export const csvFilename = (year: string) =>
  `roadsense-accidents-${year === ALL ? "all-years" : year}.csv`;

export function downloadCsv(records: AccidentRecord[], filename: string) {
  const blob = new Blob(["\uFEFF" + toCsv(records)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
