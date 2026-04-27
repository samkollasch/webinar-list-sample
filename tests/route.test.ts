import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { GET } from "../app/api/webinar-list/route";
import { ALL_WEBINARS } from "@/lib/data/webinars";
import type { PaginatedWebinars } from "@/types";

function buildRequest(search: string): NextRequest {
  return new NextRequest(`http://localhost/api/webinar-list?${search}`);
}

describe("GET /api/webinar-list", () => {
  it("returns the first page of all webinars by default", async () => {
    const response = await GET(buildRequest(""));
    expect(response.status).toBe(200);

    const body = (await response.json()) as PaginatedWebinars;
    expect(body.total).toBe(ALL_WEBINARS.length);
    expect(body.webinars).toHaveLength(6);

    // Newest-first ordering.
    const dates = body.webinars.map((w) => new Date(w.publishedAt).getTime());
    const sorted = [...dates].sort((a, b) => b - a);
    expect(dates).toEqual(sorted);
  });

  it("paginates by `page` query string", async () => {
    const first = (await (await GET(buildRequest("page=1"))).json()) as PaginatedWebinars;
    const second = (await (await GET(buildRequest("page=2"))).json()) as PaginatedWebinars;

    const overlap = first.webinars.filter((w) =>
      second.webinars.some((s) => s.id === w.id),
    );
    expect(overlap).toHaveLength(0);
    expect(second.webinars.length).toBeGreaterThan(0);
  });

  it("filters by category", async () => {
    const response = await GET(buildRequest("category=customer-experience"));
    const body = (await response.json()) as PaginatedWebinars;

    expect(body.webinars.length).toBeGreaterThan(0);
    expect(
      body.webinars.every((w) => w.category === "customer-experience"),
    ).toBe(true);
    expect(body.total).toBe(
      ALL_WEBINARS.filter((w) => w.category === "customer-experience").length,
    );
  });

  it("ignores unknown categories and falls back to the full list", async () => {
    const response = await GET(buildRequest("category=does-not-exist"));
    const body = (await response.json()) as PaginatedWebinars;
    expect(body.total).toBe(ALL_WEBINARS.length);
  });

  it("rejects non-numeric pages with a 400", async () => {
    const response = await GET(buildRequest("page=abc"));
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body).toMatchObject({ error: expect.stringContaining("Invalid") });
  });

  it("sets a Cache-Control header for shared caching", async () => {
    const response = await GET(buildRequest(""));
    expect(response.headers.get("cache-control")).toMatch(/s-maxage/);
  });
});
