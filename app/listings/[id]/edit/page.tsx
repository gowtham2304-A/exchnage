import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ListingStatus } from "@prisma/client";
import NewListingForm from "@/app/components/new-listing-form";
import Logo from "@/app/components/logo";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const listing = await prisma.listing.findFirst({
    where: { id, status: { not: ListingStatus.ARCHIVED } },
  });

  if (!listing) {
    redirect("/listings");
  }

  if (listing.ownerId !== session.user.id) {
    redirect("/listings");
  }

  const initialData = {
    title: listing.title,
    description: listing.description,
    category: listing.category,
    size: listing.size,
    condition: listing.condition,
    pricePer24Hours: listing.pricePerDay.toString(),
    securityDeposit: listing.securityDeposit.toString(),
    location: listing.location,
    imageUrl: listing.imageUrl || "",
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" className="transition hover:opacity-90">
          <Logo />
        </Link>
        <Link href={`/listings/${id}`} className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] hover:text-black">
          Cancel Edit
        </Link>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="heading-font text-3xl font-black uppercase tracking-tight sm:text-4xl">Edit Listing</h1>
        <p className="mt-2 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
          Update the fields below to modify your item.
        </p>

        <NewListingForm listingId={listing.id} initialData={initialData} />
      </main>
    </div>
  );
}
