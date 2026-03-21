import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="heading-font text-4xl font-bold">Terms &amp; Conditions</h1>
      <p className="mt-4 text-[var(--muted)]">
        Effective date: March 21, 2026
      </p>

      <section className="mt-8 space-y-4 text-[var(--foreground)]">
        <p>
          DivineBridge is a digital marketplace that connects clothing owners and renters.
          We only act as a bridge platform for listing, discovery, and communication.
        </p>
        <p>
          By using this website, you agree that all rentals, handovers, returns, and payments
          are conducted at your own risk. Users are responsible for verifying item condition,
          size, and suitability before confirming a rental.
        </p>
        <p>
          DivineBridge is not responsible for any loss, theft, damage, defects, injuries,
          accidents, delays, or disputes related to listed items or offline exchanges.
        </p>
        <p>
          Users must comply with local laws and university rules. Any misuse, fraudulent
          activity, abusive behavior, or policy violations may result in account suspension.
        </p>
        <p>
          These terms may be updated at any time. Continued use of the platform means you
          accept the latest version.
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
