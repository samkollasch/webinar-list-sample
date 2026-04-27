import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Webinar List — Code Sample",
  description:
    "Paginated, filterable webinar list demonstrating React Query data fetching, Next.js route handlers, and Vitest testing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
