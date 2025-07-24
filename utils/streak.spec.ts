import { computeStreak } from "./streak";

describe("computeStreak", () => {
  const baseDate = new Date("2024-09-30");

  it("should return 0 for an empty completion dates object", () => {
    expect(computeStreak({}, baseDate)).toBe(0);
  });

  it("should return 1 for a single completion on the current day", () => {
    expect(computeStreak({ "2024-09-30": true }, baseDate)).toBe(1);
  });

  it("should return 1 for a single completion on the previous day", () => {
    expect(computeStreak({ "2024-09-29": true }, baseDate)).toBe(1);
  });

  it("should return 3 for three consecutive days including yesterday", () => {
    const completionDates = {
      "2024-09-29": true,
      "2024-09-28": true,
      "2024-09-27": true,
    };
    expect(computeStreak(completionDates, baseDate)).toBe(3);
  });

  it("should return 4 for four consecutive days including today", () => {
    const completionDates = {
      "2024-09-30": true,
      "2024-09-29": true,
      "2024-09-28": true,
      "2024-09-27": true,
    };
    expect(computeStreak(completionDates, baseDate)).toBe(4);
  });

  it("should return 0 if the most recent completion is before yesterday", () => {
    const completionDates = {
      "2024-09-28": true,
      "2024-09-27": true,
    };
    expect(computeStreak(completionDates, baseDate)).toBe(0);
  });

  it("should handle non-consecutive days correctly", () => {
    const completionDates = {
      "2024-09-29": true,
      "2024-09-28": true,
      "2024-09-26": true,
    };
    expect(computeStreak(completionDates, baseDate)).toBe(2);
  });

  it("should handle future dates correctly", () => {
    const completionDates = {
      "2024-10-01": true,
      "2024-09-30": true,
      "2024-09-29": true,
    };
    expect(computeStreak(completionDates, baseDate)).toBe(2);
  });

  it("should handle a base date in the past", () => {
    const completionDates = {
      "2024-09-30": true,
      "2024-09-29": true,
      "2024-09-28": true,
    };
    expect(computeStreak(completionDates, new Date("2024-09-29"))).toBe(2);
  });
});
