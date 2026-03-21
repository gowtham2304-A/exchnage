import Link from "next/link";
import { getServerSession } from "next-auth";
import { ListingStatus } from "@prisma/client";
import Logo from "@/app/components/logo";
import ListingMessageBox from "@/app/components/messaging/listing-message-box";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ListingDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

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
    owner: { id: string; name: string | null; email: string | null };
  } | null = null;

  try {
    listing = await prisma.listing.findFirst({
      where: {
        id: id,
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
            id: true,
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
          <Link href="/" className="transition hover:opacity-90">
            <Logo />
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
        <Link href="/" className="transition hover:opacity-90">
          <Logo />
        </Link>
        <Link href="/listings" className="text-sm font-semibold text-[var(--brand)]">
          Back to listings
        </Link>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div className="reveal-up">
            {listing.imageUrl ? (
              <div className="overflow-hidden w-full bg-[var(--surface)]">
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="h-auto w-full object-cover aspect-[3/4]"
                />
              </div>
            ) : (
              <div className="flex aspect-[3/4] w-full items-center justify-center bg-[var(--surface)] text-[10px] uppercase tracking-widest font-medium text-[var(--muted)]">
                No Image
              </div>
            )}
          </div>

          <div className="reveal-up-delay lg:py-8">
            <p className="inline-block border border-black px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-black">
              {listing.category}
            </p>
            <h1 className="heading-font mt-8 text-4xl font-black uppercase tracking-tight sm:text-5xl">{listing.title}</h1>

            <div className="mt-8 flex items-end gap-2">
              <span className="heading-font text-2xl font-bold text-[var(--foreground)]">
                Rs {Number(listing.pricePerDay).toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1">/ day</span>
            </div>

            <p className="mt-8 text-sm leading-loose tracking-wide text-[var(--muted)]">{listing.description}</p>

            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[var(--line)] pt-8 text-sm">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Security Deposit</span>
                <span className="mt-2 block font-medium uppercase tracking-wider text-[var(--foreground)]">Rs {Number(listing.securityDeposit).toLocaleString("en-IN")}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Size</span>
                <span className="mt-2 block font-medium uppercase tracking-wider text-[var(--foreground)]">{listing.size}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Condition</span>
                <span className="mt-2 block font-medium uppercase tracking-wider text-[var(--foreground)]">{listing.condition.replaceAll("_", " ")}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Location</span>
                <span className="mt-2 block font-medium uppercase tracking-wider text-[var(--foreground)]">{listing.location}</span>
              </div>
              <div className="col-span-2">
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Owner</span>
                <span className="mt-2 block font-medium uppercase tracking-wider text-[var(--foreground)]">{listing.owner.name ?? "Archive"}</span>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-4">
              <Link href="/messages" className="flex h-14 w-full items-center justify-center bg-black px-8 text-[12px] uppercase tracking-[0.2em] font-bold text-white transition hover:bg-[var(--brand)]">
                Message Renter
              </Link>
              {listing.owner.email ? (
                <a
                  href={`mailto:${listing.owner.email}`}
                  className="flex h-14 w-full items-center justify-center border border-[var(--line)] bg-transparent px-8 text-[12px] uppercase tracking-[0.2em] font-bold transition hover:border-black"
                >
                  Email
                </a>
              ) : null}
            </div>

            {session?.user?.id ? (
              session.user.id !== listing.owner.id ? (
                <ListingMessageBox listingId={listing.id} recipientId={listing.owner.id} />
              ) : (
                <p className="mt-4 text-sm text-[var(--muted)]">This is your own listing.</p>
              )
            ) : (
              <p className="mt-4 text-sm text-[var(--muted)]">
                Please <Link href="/auth/signin" className="font-semibold text-[var(--brand)]">sign in</Link> to message the owner in-app.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
