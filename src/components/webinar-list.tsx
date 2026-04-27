"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import type {
  PaginatedWebinars,
  WebinarCategory,
  WebinarCategorySlug,
} from "@/types";
import { buildPageWindow, PAGE_GAP } from "@/lib/pagination";

import { CategorySelect } from "./ui/category-select";
import { Container } from "./ui/container";
import { WebinarCard } from "./webinar-card";

const ITEMS_PER_PAGE = 6;

interface WebinarListProps {
  heading: string;
  initialData: PaginatedWebinars;
  categories: WebinarCategory[];
}

async function fetchWebinarList(
  page: number,
  category: WebinarCategorySlug | "",
  signal?: AbortSignal,
): Promise<PaginatedWebinars> {
  const params = new URLSearchParams({ page: String(page) });
  if (category) {
    params.set("category", category);
  }

  const response = await fetch(`/api/webinar-list?${params.toString()}`, {
    signal,
  });
  if (!response.ok) {
    throw new Error(`Failed to load webinars (status ${response.status})`);
  }
  return response.json();
}

/**
 * Lists paginated, optionally-filtered webinars sourced from the
 * `/api/webinar-list` route. Uses TanStack Query so we get caching,
 * loading state, and request cancellation for free, plus first-render
 * SSR data via `initialData`.
 */
export function WebinarList({ heading, initialData, categories }: WebinarListProps) {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<WebinarCategorySlug | "">("");

  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetching, isError, error } = useQuery<
    PaginatedWebinars,
    Error
  >({
    queryKey: ["webinar-list", page, category],
    queryFn: ({ signal }) => fetchWebinarList(page, category, signal),
    placeholderData: (prev) => prev,
    initialData: page === 1 && category === "" ? initialData : undefined,
    staleTime: 30_000,
  });

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const pages = buildPageWindow({ current: page, total: totalPages });

  // Reset to page 1 whenever the category changes — without this the user
  // can ask for "page 4 of customer-experience" before they've ever seen
  // page 1 of that filter.
  useEffect(() => {
    setPage(1);
  }, [category]);

  // After a page change, scroll the list back into view so the user can
  // see the new results without manually scrolling.
  useEffect(() => {
    if (page === 1) return;
    const node = containerRef.current;
    if (!node) return;
    const top = node.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }, [page]);

  return (
    <Container className="my-12 flex flex-col gap-8">
      <div
        ref={containerRef}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <h2 className="text-3xl font-bold text-neutral-900">{heading}</h2>
        <CategorySelect
          value={category}
          onChange={setCategory}
          categories={categories}
        />
      </div>

      {isError ? (
        <div role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          Couldn&apos;t load webinars: {error.message}
        </div>
      ) : null}

      <div
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        aria-busy={isFetching && !isLoading}
      >
        {isLoading ? (
          <SkeletonRow />
        ) : data && data.webinars.length > 0 ? (
          data.webinars.map((webinar) => (
            <WebinarCard key={webinar.id} webinar={webinar} />
          ))
        ) : (
          <p className="col-span-full text-sm text-neutral-500">
            No webinars match this filter yet — check back soon.
          </p>
        )}
      </div>

      {totalPages > 1 ? (
        <nav aria-label="Pagination" className="flex justify-center gap-2">
          {pages.map((entry, index) =>
            entry === PAGE_GAP ? (
              <span
                key={`gap-${index}`}
                aria-hidden="true"
                className="px-2 text-neutral-400"
              >
                …
              </span>
            ) : (
              <button
                key={entry}
                type="button"
                aria-current={entry === page ? "page" : undefined}
                aria-label={`Go to page ${entry}`}
                onClick={() => setPage(entry)}
                className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors ${
                  entry === page
                    ? "bg-brand-primary text-white"
                    : "bg-brand-tertiary text-neutral-900 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                {entry}
              </button>
            ),
          )}
        </nav>
      ) : null}
    </Container>
  );
}

function SkeletonRow() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-44 animate-pulse rounded-xl border border-neutral-200 bg-neutral-100"
        />
      ))}
    </>
  );
}
