"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ListingManageOptions({ listingId }: { listingId: string }) {
  const router = useRouter();

  async function handleArchive() {
    if (confirm("Are you sure you want to archive this listing? It will no longer be visible to others.")) {
      const response = await fetch(`/api/listings/${listingId}`, { method: "DELETE" });
      if (response.ok) {
        router.push("/listings");
      } else {
        alert("Failed to archive listing. Please try again.");
      }
    }
  }

  return (
    <div className="mt-16 pt-12 border-t border-[var(--line)]">
      <h2 className="heading-font text-[13px] font-bold uppercase tracking-[0.2em] mb-6 text-[var(--foreground)]">Manage Your Listing</h2>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href={`/listings/${listingId}/edit`}
          className="flex h-12 w-full items-center justify-center bg-black px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-gray-800 sm:w-auto sm:flex-1"
        >
          Edit Details
        </Link>
        <button
          onClick={handleArchive}
          className="flex h-12 w-full items-center justify-center border border-[var(--line)] bg-transparent px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-red-600 transition hover:border-red-600 hover:bg-red-50 sm:w-auto sm:flex-1"
        >
          Archive Listing
        </button>
      </div>
    </div>
  );
}
