import { describe, expect, it } from "vitest";

import {
  buildPageWindow,
  PAGE_GAP,
  pageRange,
} from "@/lib/pagination";

describe("buildPageWindow", () => {
  it("returns an empty array when there are no pages", () => {
    expect(buildPageWindow({ current: 1, total: 0 })).toEqual([]);
  });

  it("renders all pages without gaps when there are few of them", () => {
    expect(buildPageWindow({ current: 1, total: 1 })).toEqual([1]);
    expect(buildPageWindow({ current: 1, total: 3 })).toEqual([1, 2, 3]);
    expect(buildPageWindow({ current: 2, total: 3 })).toEqual([1, 2, 3]);
  });

  it("inserts a single trailing gap when the user is near the start", () => {
    expect(buildPageWindow({ current: 1, total: 10 })).toEqual([1, 2, PAGE_GAP, 10]);
    expect(buildPageWindow({ current: 2, total: 10 })).toEqual([
      1, 2, 3, PAGE_GAP, 10,
    ]);
  });

  it("inserts both gaps when the user is in the middle", () => {
    expect(buildPageWindow({ current: 5, total: 10 })).toEqual([
      1,
      PAGE_GAP,
      4,
      5,
      6,
      PAGE_GAP,
      10,
    ]);
  });

  it("inserts a single leading gap when the user is near the end", () => {
    expect(buildPageWindow({ current: 9, total: 10 })).toEqual([
      1,
      PAGE_GAP,
      8,
      9,
      10,
    ]);
    expect(buildPageWindow({ current: 10, total: 10 })).toEqual([
      1,
      PAGE_GAP,
      9,
      10,
    ]);
  });

  it("clamps the current page into the valid range", () => {
    expect(buildPageWindow({ current: 99, total: 5 })).toEqual([1, PAGE_GAP, 4, 5]);
    expect(buildPageWindow({ current: -1, total: 5 })).toEqual([1, 2, PAGE_GAP, 5]);
  });
});

describe("pageRange", () => {
  it("computes inclusive ranges relative to the requested page", () => {
    expect(pageRange(1, 6)).toEqual({ from: 0, to: 5 });
    expect(pageRange(2, 6)).toEqual({ from: 6, to: 11 });
    expect(pageRange(5, 10)).toEqual({ from: 40, to: 49 });
  });

  it("clamps non-positive pages to page 1", () => {
    expect(pageRange(0, 6)).toEqual({ from: 0, to: 5 });
    expect(pageRange(-3, 6)).toEqual({ from: 0, to: 5 });
  });
});
