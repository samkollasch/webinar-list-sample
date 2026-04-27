/**
 * Pagination helpers. Extracted into a pure module so the route handler and
 * the React component agree on the page-window math, and so the rules are
 * easy to unit-test.
 */

export interface PageWindowOptions {
  /** 1-indexed page the user is currently viewing. */
  current: number;
  /** Total number of pages. */
  total: number;
}

/**
 * Sentinel value emitted in the page list to mark a gap (rendered as `…`).
 * Keeps the consumer free of magic numbers when iterating.
 */
export const PAGE_GAP = -1 as const;
export type PageWindowEntry = number | typeof PAGE_GAP;

/**
 * Builds a sliding window of page numbers around the current page, with
 * gaps inserted when the window doesn't reach the first or last page.
 *
 * Examples (with current/total):
 *   1/1   → [1]
 *   1/3   → [1, 2, 3]
 *   1/10  → [1, 2, …, 10]
 *   5/10  → [1, …, 4, 5, 6, …, 10]
 *   10/10 → [1, …, 9, 10]
 */
export function buildPageWindow({ current, total }: PageWindowOptions): PageWindowEntry[] {
  if (total <= 0) return [];

  const safeCurrent = Math.min(Math.max(current, 1), total);
  const window: PageWindowEntry[] = [];

  if (safeCurrent > 2) {
    window.push(1);
    if (safeCurrent > 3) {
      window.push(PAGE_GAP);
    }
  }

  for (
    let i = Math.max(1, safeCurrent - 1);
    i <= Math.min(total, safeCurrent + 1);
    i++
  ) {
    window.push(i);
  }

  if (safeCurrent < total - 1) {
    if (safeCurrent < total - 2) {
      window.push(PAGE_GAP);
    }
    window.push(total);
  }

  return window;
}

/**
 * Translates a 1-indexed page into the half-open range expected by the
 * underlying data layer. Mirrors the Sanity GROQ `[from..to]` slice the
 * production app used.
 */
export interface PageRange {
  from: number;
  to: number;
}

export function pageRange(page: number, itemsPerPage: number): PageRange {
  const safePage = Math.max(page, 1);
  const from = (safePage - 1) * itemsPerPage;
  return { from, to: from + itemsPerPage - 1 };
}
