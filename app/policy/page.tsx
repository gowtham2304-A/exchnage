import Link from "next/link";

export default function PolicyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="heading-font text-4xl font-bold">Policy</h1>
      <p className="mt-4 text-[var(--muted)]">Effective date: March 21, 2026</p>

      <section className="mt-8 space-y-4 text-[var(--foreground)]">
        <p>
          DivineBridge follows a bridge-only platform model. We enable users to connect and
          transact, but we do not own, inspect, transport, or insure listed clothing items.
        </p>
        <p>
          Safety policy: users should meet only at trusted public or campus locations and
          record item condition with photos at handover and return.
        </p>
        <p>
          Damage and liability policy: any damage, loss, theft, quality issue, or fit issue is
          the responsibility of the involved users. DivineBridge is not liable for direct or
          indirect losses resulting from rentals or exchanges.
        </p>
        <p>
          Data policy: we store account and listing data to operate the platform and improve
          safety. We do not sell personal data to third parties.
        </p>
        <p>
          Report policy: users may report abuse, scams, or inappropriate listings. We may
          remove content or suspend accounts that violate our rules.
        </p>
      </section>

      <Link
        href="/"
        className="mt-10 inline-flex rounded-full border border-[var(--foreground)] px-5 py-2 text-sm font-semibold"
      >
        Back to Home
      </Link>
    </main>
  );
}
