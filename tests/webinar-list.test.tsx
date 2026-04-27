import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { WebinarList } from "@/components/webinar-list";
import { listCategories, listWebinars } from "@/lib/data/repository";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function renderList() {
  const initial = listWebinars({ page: 1, itemsPerPage: 6 });
  const categories = listCategories();
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  });

  return render(
    <QueryClientProvider client={client}>
      <WebinarList
        heading="On-demand webinars"
        initialData={initial}
        categories={categories}
      />
    </QueryClientProvider>,
  );
}

describe("<WebinarList />", () => {
  beforeEach(() => {
    // Default mock returns page 2 — distinguishable from the SSR-injected
    // page 1 so we can verify the fetch happened.
    vi.spyOn(globalThis, "fetch").mockImplementation(
      async (input: RequestInfo | URL) => {
        const url = typeof input === "string" ? input : input.toString();
        const params = new URL(url, "http://localhost").searchParams;
        const page = Number(params.get("page") ?? "1");
        const category = params.get("category") ?? undefined;
        const data = listWebinars({ page, itemsPerPage: 6, category });
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    );

    // jsdom doesn't implement scrollTo; stub it out so the page-change
    // effect doesn't blow up.
    vi.stubGlobal("scrollTo", vi.fn());
  });

  it("renders the SSR-provided initial page without firing a fetch", () => {
    renderList();

    expect(
      screen.getByRole("heading", { name: /on-demand webinars/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(6);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("fetches the next page when a pagination button is clicked", async () => {
    const user = userEvent.setup();
    renderList();

    await user.click(screen.getByRole("button", { name: /go to page 2/i }));

    await vi.waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    const callUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    expect(callUrl).toContain("page=2");

    const page2Articles = await screen.findAllByRole("article");
    expect(page2Articles.length).toBeGreaterThan(0);

    expect(
      screen.getByRole("button", { name: /go to page 2/i }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("filters by category and resets to the first page", async () => {
    const user = userEvent.setup();
    renderList();

    // Move off page 1 so we can prove the filter resets.
    await user.click(screen.getByRole("button", { name: /go to page 2/i }));
    await vi.waitFor(() =>
      expect(
        screen.getByRole("button", { name: /go to page 2/i }),
      ).toHaveAttribute("aria-current", "page"),
    );

    const filter = screen.getByLabelText(/filter by/i);
    await user.selectOptions(filter, "customer-experience");

    await vi.waitFor(() => {
      const last = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls.at(
        -1,
      )?.[0] as string;
      expect(last).toContain("category=customer-experience");
      expect(last).toContain("page=1");
    });

    const articles = await screen.findAllByRole("article");
    expect(articles.length).toBeGreaterThan(0);
    articles.forEach((article) => {
      expect(within(article).getByText(/customer experience/i)).toBeInTheDocument();
    });
  });

  it("renders an error state when the request fails", async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockImplementation(
      async () =>
        new Response(JSON.stringify({ error: "boom" }), { status: 500 }),
    );

    const user = userEvent.setup();
    renderList();
    await user.click(screen.getByRole("button", { name: /go to page 2/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn’t load|couldn't load/i);
  });
});
