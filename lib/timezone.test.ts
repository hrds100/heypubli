import { describe, it, expect } from "vitest";
import { spLocalToUtcIso, utcIsoToSpLocal, formatSaoPaulo } from "./timezone";

describe("spLocalToUtcIso", () => {
  it("treats a datetime-local string as São Paulo time (UTC-3)", () => {
    expect(spLocalToUtcIso("2026-06-12T17:00")).toBe("2026-06-12T20:00:00.000Z");
  });

  it("accepts seconds", () => {
    expect(spLocalToUtcIso("2026-06-12T17:00:30")).toBe("2026-06-12T20:00:30.000Z");
  });
});

describe("utcIsoToSpLocal", () => {
  it("converts UTC back to a datetime-local string in São Paulo time", () => {
    expect(utcIsoToSpLocal("2026-06-12T20:00:00.000Z")).toBe("2026-06-12T17:00");
  });

  it("round-trips with spLocalToUtcIso", () => {
    expect(utcIsoToSpLocal(spLocalToUtcIso("2026-01-05T08:30"))).toBe("2026-01-05T08:30");
  });
});

describe("formatSaoPaulo", () => {
  it("renders a UTC timestamp as pt-BR date/time in São Paulo", () => {
    expect(formatSaoPaulo("2026-06-12T20:00:00Z")).toBe("12/06/2026, 17:00");
  });
});
