"use client";

import type { WebinarCategory, WebinarCategorySlug } from "@/types";

interface CategorySelectProps {
  value: WebinarCategorySlug | "";
  onChange: (next: WebinarCategorySlug | "") => void;
  categories: WebinarCategory[];
  id?: string;
}

/**
 * Native `<select>` styled to match the original Base UI component. Native
 * picks come with built-in keyboard support and accessibility, which keeps
 * the sample code focused on data flow rather than UI plumbing.
 */
export function CategorySelect({
  value,
  onChange,
  categories,
  id = "category-select",
}: CategorySelectProps) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="text-sm text-neutral-600">
        Filter by
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as WebinarCategorySlug | "")}
        className="min-w-[220px] rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none"
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
