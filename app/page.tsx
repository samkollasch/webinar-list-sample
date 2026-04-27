import { WebinarList } from "@/components/webinar-list";
import { listCategories, listWebinars } from "@/lib/data/repository";

export default async function HomePage() {
  // Server-side fetch the first page so the list renders without a flash of
  // skeletons. TanStack Query then takes over for subsequent pages.
  const initial = listWebinars({ page: 1, itemsPerPage: 6 });
  const categories = listCategories();

  return (
    <main className="py-8">
      <WebinarList
        heading="On-demand webinars"
        initialData={initial}
        categories={categories}
      />
    </main>
  );
}
