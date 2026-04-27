import type { Webinar } from "@/types";

interface WebinarCardProps {
  webinar: Webinar;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function WebinarCard({ webinar }: WebinarCardProps) {
  return (
    <article className="group relative flex h-full flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md">
      <p className="text-xs font-semibold tracking-wide text-brand-primary uppercase">
        {webinar.category.replace(/-/g, " ")}
      </p>
      <h3 className="text-lg leading-tight font-semibold text-neutral-900">
        <a href={webinar.href} className="after:absolute after:inset-0">
          {webinar.title}
        </a>
      </h3>
      <p className="text-sm text-neutral-600">{webinar.description}</p>
      <p className="mt-auto text-xs text-neutral-500">
        Published {dateFormatter.format(new Date(webinar.publishedAt))}
      </p>
    </article>
  );
}
