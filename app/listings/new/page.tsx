import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import NewListingForm from "@/app/components/new-listing-form";
import { authOptions } from "@/lib/auth";

export default async function NewListingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-12">
      <h1 className="heading-font text-4xl font-bold">List a New Item</h1>
      <p className="mt-2 text-[var(--muted)]">
        Add full details including description and price for 24 hours.
      </p>

      <NewListingForm />

      <div className="mt-6">
        <Link href="/profile" className="text-sm font-semibold text-[var(--brand)]">
          Back to profile
        </Link>
      </div>
    </main>
  );
}
