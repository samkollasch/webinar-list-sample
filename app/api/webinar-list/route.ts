import { NextRequest } from "next/server";

import { listWebinars } from "@/lib/data/repository";

const ITEMS_PER_PAGE = 6;

/**
 * GET /api/webinar-list?page=1&category=most-popular
 *
 * Returns a paginated slice of webinars filtered by the optional category.
 * The route is a thin wrapper around `listWebinars` so the same logic can
 * be exercised directly in tests.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pageParam = searchParams.get("page") ?? "1";
  const category = searchParams.get("category");

  const page = Number.parseInt(pageParam, 10);
  if (Number.isNaN(page) || page < 1) {
    return Response.json(
      { error: "Invalid `page` parameter. Expected a positive integer." },
      { status: 400 },
    );
  }

  const result = listWebinars({
    page,
    itemsPerPage: ITEMS_PER_PAGE,
    category: category || undefined,
  });

  return Response.json(result, {
    headers: {
      // Mirror the production cache profile — fresh on every navigation
      // while the page is open, and short-lived shared cache for bursts.
      "Cache-Control": "public, max-age=0, s-maxage=60",
    },
  });
}
