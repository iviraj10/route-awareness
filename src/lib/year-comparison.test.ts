import { describe, expect, it } from "vitest";
import { compareYears, pctChange } from "./year-comparison";
import { accidents } from "@/data/accidents";

describe("pctChange", () => {
  it("increase uses (B-A)/A with one decimal", () => expect(pctChange(40, 46)).toBe("+15.0%"));
  it("decrease", () => expect(pctChange(3, 2)).toBe("−33.3%"));
  it("zero baseline", () => expect(pctChange(0, 5)).toBe("N/A — no baseline records"));
  it("both zero", () => expect(pctChange(0, 0)).toBe("No change"));
  it("drop to zero", () => expect(pctChange(7, 0)).toBe("−100.0%"));
});

describe("compareYears", () => {
  it("totals match the dataset year counts", () => {
    const c = compareYears(accidents, 2022, 2023);
    expect(c.a.total).toBe(accidents.filter((a) => a.year === 2022).length);
    expect(c.b.total).toBe(accidents.filter((a) => a.year === 2023).length);
  });
  it("shows at most five accident types", () => {
    expect(compareYears(accidents, 2022, 2023).types.length).toBeLessThanOrEqual(5);
  });
});
