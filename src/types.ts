/**
 * Domain types for the webinar list. The original codebase derived these
 * from a Sanity CMS query result; here we redeclare them so the sample is
 * self-contained.
 */

export interface Webinar {
  id: string;
  href: string;
  title: string;
  description: string;
  publishedAt: string;
  category: WebinarCategorySlug;
  thumbnailUrl?: string;
}

export interface WebinarCategory {
  slug: WebinarCategorySlug;
  name: string;
}

export type WebinarCategorySlug =
  | "most-popular"
  | "product-demos"
  | "customer-experience"
  | "strategy"
  | "operations";

export interface PaginatedWebinars {
  webinars: Webinar[];
  total: number;
}
