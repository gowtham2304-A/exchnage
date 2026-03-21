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
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {listings.map((listing, i) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="group flex flex-col reveal-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[var(--line)]/50">
                  {listing.imageUrl ? (
                    <img
                      src={listing.imageUrl}
                      alt={listing.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-medium text-[var(--muted)]">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)]">
                    {listing.category}
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col pt-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="heading-font text-base font-bold leading-snug line-clamp-2 text-[var(--foreground)] transition-colors group-hover:text-[var(--brand)]">
                      {listing.title}
                    </h2>
                    <p className="heading-font shrink-0 text-base font-extrabold text-[var(--foreground)]">
                      Rs {Number(listing.pricePerDay).toLocaleString("en-IN")}
                      <span className="block text-right text-[10px] font-semibold text-[var(--muted)]">/day</span>
                    </p>
                  </div>
                  <p className="mt-1 text-sm font-medium text-[var(--muted)]">
                    By {listing.owner.name ?? "Verified Owner"} • {listing.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
