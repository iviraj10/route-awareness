import { describe, expect, it } from "vitest";
import { accidents } from "@/data/accidents";
import { applyFilters, emptyFilters } from "@/lib/accident-analytics";
import { csvFilename, escapeCsv, toCsv } from "@/lib/csv-export";

describe("csv export", () => {
  it("exports all records plus header", () => {
    expect(toCsv(accidents).split("\r\n")).toHaveLength(accidents.length + 1);
  });
  it("exports only filtered year", () => {
    const rows = applyFilters(accidents, { ...emptyFilters, year: "2022" });
    const lines = toCsv(rows).split("\r\n").slice(1);
    expect(lines.length).toBe(rows.length);
    expect(lines.every((l) => l.split(",")[2] === "2022")).toBe(true);
  });
  it("escapes commas, quotes and newlines", () => {
    expect(escapeCsv('a,"b"\nc')).toBe('"a,""b""\nc"');
  });
  it("names files by year", () => {
    expect(csvFilename("2022")).toBe("roadsense-accidents-2022.csv");
    expect(csvFilename("all")).toBe("roadsense-accidents-all-years.csv");
  });
});
