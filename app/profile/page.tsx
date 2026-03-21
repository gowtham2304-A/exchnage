import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/profile");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-12">
      <h1 className="heading-font text-4xl font-bold">Your Profile</h1>
      <p className="mt-2 text-[var(--muted)]">You are signed in and ready to start listing.</p>

      <section className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
        <p><span className="font-semibold">Name:</span> {session.user.name ?? "Not set"}</p>
        <p className="mt-2"><span className="font-semibold">Email:</span> {session.user.email ?? "Not set"}</p>
        <p className="mt-2"><span className="font-semibold">User ID:</span> {session.user.id ?? "Not available"}</p>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/listings/new" className="rounded-xl bg-[var(--brand)] px-6 py-3 text-sm font-bold text-white">
          List New Item
        </Link>
        <Link href="/listings" className="rounded-xl bg-[var(--brand)] px-6 py-3 text-sm font-bold text-white">
          Browse Listings
        </Link>
        <Link href="/" className="rounded-xl border border-[var(--line)] bg-white px-6 py-3 text-sm font-semibold">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
