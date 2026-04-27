import { ALL_WEBINARS, CATEGORIES } from "./webinars";
import { pageRange } from "../pagination";
import type {
  PaginatedWebinars,
  WebinarCategory,
  WebinarCategorySlug,
} from "@/types";

const VALID_CATEGORIES = new Set<WebinarCategorySlug>(
  CATEGORIES.map((c) => c.slug),
);

export interface ListWebinarsOptions {
  page?: number;
  itemsPerPage?: number;
  category?: string | null;
}

/**
 * Mirrors the route handler's data contract: page + optional category in,
 * `{ webinars, total }` out. Pulled out of the handler so it can be
 * unit-tested without `NextRequest` ceremony.
 */
export function listWebinars({
  page = 1,
  itemsPerPage = 6,
  category,
}: ListWebinarsOptions = {}): PaginatedWebinars {
  const filtered =
    category && VALID_CATEGORIES.has(category as WebinarCategorySlug)
      ? ALL_WEBINARS.filter((w) => w.category === category)
      : ALL_WEBINARS;

  const sorted = [...filtered].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const { from, to } = pageRange(page, itemsPerPage);
  return {
    webinars: sorted.slice(from, to + 1),
    total: sorted.length,
  };
}

export function listCategories(): WebinarCategory[] {
  return CATEGORIES;
}
