import Link from "next/link";
import { ListingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Logo from "@/app/components/logo";

export const dynamic = "force-dynamic";

type ListingsPageProps = {
  searchParams?: {
    category?: string;
  };
};

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const category = searchParams?.category?.trim();
  let dbError = false;

  let categories: string[] = [];
  let listings: Array<{
    id: string;
    title: string;
    category: string;
    pricePerDay: unknown;
    imageUrl: string | null;
    location: string;
    owner: { name: string | null };
  }> = [];

  try {
    const activeCategoriesPromise = prisma.listing.findMany({
      where: { status: ListingStatus.ACTIVE },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });

    const listingsPromise = prisma.listing.findMany({
      where: {
        status: ListingStatus.ACTIVE,
        ...(category ? { category } : {}),
      },
      select: {
        id: true,
        title: true,
        category: true,
        pricePerDay: true,
        imageUrl: true,
        location: true,
        owner: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const [activeCategories, fetchedListings] = await Promise.all([
      activeCategoriesPromise,
      listingsPromise,
    ]);

    categories = activeCategories.map((entry) => entry.category);
    listings = fetchedListings;
  } catch {
    dbError = true;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" className="transition hover:opacity-90">
          <Logo />
        </Link>
        <Link href="/#waitlist" className="rounded-full border border-[var(--foreground)] bg-white px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5">
          Join Waitlist
        </Link>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="heading-font text-4xl font-bold">Browse Listings</h1>
          <p className="mt-2 text-[var(--muted)]">
            {dbError
              ? "Listings are temporarily unavailable. Please try again shortly."
              : category
              ? `Showing ${listings.length} real listings in "${category}"`
              : `Showing all ${listings.length} active listings`}
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/listings"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              !category
                ? "bg-[var(--brand)] text-white"
                : "border border-[var(--line)] hover:bg-[var(--surface)]"
            }`}
          >
            All Categories
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/listings?category=${encodeURIComponent(cat)}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                category === cat
                  ? "bg-[var(--brand)] text-white"
                  : "border border-[var(--line)] hover:bg-[var(--surface)]"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {dbError ? (
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-12 text-center">
            <p className="text-lg text-[var(--muted)]">We could not load products right now.</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Please check deployment environment variables and database migrations.</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-12 text-center">
            <p className="text-lg text-[var(--muted)]">No active listings found.</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Add products to your database and they will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="group rounded-2xl border border-[var(--line)] bg-[var(--surface)] overflow-hidden transition hover:shadow-lg hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden bg-[var(--background)]">
                  {listing.imageUrl ? (
                    <img
                      src={listing.imageUrl}
                      alt={listing.title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="heading-font font-semibold line-clamp-2">{listing.title}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {listing.owner.name ?? "Verified owner"}  {listing.location}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="heading-font text-lg font-bold">
                        Rs {Number(listing.pricePerDay).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-[var(--muted)]">per day</p>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand)]">
                      {listing.category}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
