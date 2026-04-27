import type { Webinar, WebinarCategory, WebinarCategorySlug } from "@/types";

/**
 * In-memory data layer that stands in for the Sanity CMS query the original
 * code consumed. Keeping the sample fully self-contained means the route
 * handler can be exercised end-to-end without external services.
 */
export const CATEGORIES: WebinarCategory[] = [
  { slug: "most-popular", name: "Most popular" },
  { slug: "product-demos", name: "Product demos" },
  { slug: "customer-experience", name: "Customer experience" },
  { slug: "strategy", name: "Strategy" },
  { slug: "operations", name: "Operations" },
];

const BASE_DATE = new Date("2025-01-01T00:00:00Z").getTime();

const SEED_TITLES = [
  "How AI agents are reshaping CX in 2025",
  "From inbox to insight: rethinking voice support",
  "The customer-centric playbook for retail",
  "Scaling personalization without scaling headcount",
  "Five mistakes high-growth teams make in onboarding",
  "Live chat that doesn't feel like chat",
  "Operations leaders: building a single source of truth",
  "Connecting CX metrics to revenue",
  "Voice automation, demystified",
  "A pragmatic guide to QA for AI agents",
  "Designing handoffs that don't drop the customer",
  "Strategy 101: choosing the right CX KPIs",
  "Beyond CSAT — measuring effort, intent, and outcome",
  "Inside the modern support stack",
  "Building a knowledge base that works for AI and humans",
  "Roadmap deep dive: Q3 features unpacked",
  "Operations + product: a partnership that scales",
  "Demo: routing rules in 60 seconds",
  "From ticket queues to conversation threads",
  "Customer experience for subscription businesses",
  "How to migrate without disrupting your team",
];

const PER_CATEGORY_OFFSET: Record<WebinarCategorySlug, number> = {
  "most-popular": 0,
  "product-demos": 8,
  "customer-experience": 12,
  strategy: 16,
  operations: 20,
};

export const ALL_WEBINARS: Webinar[] = SEED_TITLES.map((title, index) => {
  const categorySlug = pickCategoryForIndex(index);
  return {
    id: `webinar-${index + 1}`,
    href: `/webinars/${slugify(title)}`,
    title,
    description:
      "A 30-minute session featuring practitioners and product leads, with time for live Q&A at the end.",
    publishedAt: new Date(BASE_DATE + index * 1000 * 60 * 60 * 24 * 7).toISOString(),
    category: categorySlug,
  };
});

function pickCategoryForIndex(index: number): WebinarCategorySlug {
  const slugs = Object.keys(PER_CATEGORY_OFFSET) as WebinarCategorySlug[];
  return slugs[index % slugs.length];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
