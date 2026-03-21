import Link from "next/link";
import { ListingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ListingDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  let listing: {
    id: string;
    title: string;
    description: string;
    category: string;
    size: string;
    condition: string;
    pricePerDay: unknown;
    securityDeposit: unknown;
    location: string;
    imageUrl: string | null;
    owner: { name: string | null; email: string | null };
  } | null = null;

  try {
    listing = await prisma.listing.findFirst({
      where: {
        id: params.id,
        status: ListingStatus.ACTIVE,
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        size: true,
        condition: true,
        pricePerDay: true,
        securityDeposit: true,
        location: true,
        imageUrl: true,
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  } catch {
    listing = null;
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/" className="heading-font flex items-center gap-2 text-2xl font-bold tracking-tight">
            DIVINEBRIDGE
          </Link>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-lg text-[var(--muted)]">Listing not found.</p>
          <Link href="/listings" className="mt-4 inline-block text-[var(--brand)] font-semibold">
            Back to listings
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" className="heading-font flex items-center gap-2 text-2xl font-bold tracking-tight">
          DIVINEBRIDGE
        </Link>
        <Link href="/listings" className="text-sm font-semibold text-[var(--brand)]">
          Back to listings
        </Link>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            {listing.imageUrl ? (
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="rounded-2xl border border-[var(--line)] object-cover w-full h-96"
              />
            ) : (
              <div className="flex h-96 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-sm text-[var(--muted)]">
                No image available
              </div>
            )}
          </div>

          <div>
            <p className="inline-block rounded-full bg-[var(--brand)] px-3 py-1 text-xs font-bold text-white">
              {listing.category}
            </p>
            <h1 className="heading-font mt-4 text-4xl font-bold">{listing.title}</h1>

            <p className="mt-4 text-lg leading-8 text-[var(--foreground)]">{listing.description}</p>

            <div className="mt-6 grid gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 text-sm">
              <p><span className="font-semibold">Price / day:</span> Rs {Number(listing.pricePerDay).toLocaleString("en-IN")}</p>
              <p><span className="font-semibold">Security deposit:</span> Rs {Number(listing.securityDeposit).toLocaleString("en-IN")}</p>
              <p><span className="font-semibold">Size:</span> {listing.size}</p>
              <p><span className="font-semibold">Condition:</span> {listing.condition.replaceAll("_", " ")}</p>
              <p><span className="font-semibold">Location:</span> {listing.location}</p>
              <p><span className="font-semibold">Owner:</span> {listing.owner.name ?? "Verified owner"}</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/#waitlist"
                className="rounded-xl bg-[var(--brand)] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Join Waitlist to Request
              </Link>
              {listing.owner.email ? (
                <a
                  href={`mailto:${listing.owner.email}`}
                  className="rounded-xl border border-[var(--line)] bg-white px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                >
                  Contact Owner
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
