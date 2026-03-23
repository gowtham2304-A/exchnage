import Link from "next/link";
import Logo from "@/app/components/logo";
import WaitlistForm from "@/app/components/waitlist-form";
import TiltCard from "@/app/components/tilt-card";

export default function Home() {
  const stats = [
    { label: "Students Waitlisted", value: "1,200+" },
    { label: "Active Wardrobes", value: "340" },
    { label: "Avg. Earnings / Month", value: "Rs 2,850" },
    { label: "Rental Requests / Week", value: "890+" },
  ];

  const steps = [
    {
      title: "List Your Look",
      description:
        "Upload photos, set price per day, and publish your wardrobe piece in less than two minutes.",
    },
    {
      title: "Confirm Match",
      description:
        "Approve requests, pick a campus handover point, and lock schedule details instantly.",
    },
    {
      title: "Earn Every Week",
      description:
        "Collect cash at handover, track returns, and build trust through ratings and reviews.",
    },
  ];

  const categories = [
    "Dresses & Gowns",
    "Jewellery & Jhumkas",
    "Bangles & Accessories",
    "Fresher party fits",
    "Placement formalwear",
    "Wedding and fest sets",
  ];

  const highlights = [
    {
      title: "Easy campus meetups",
      description:
        "Pick exactly where and when to exchange items right on campus.",
    },
    {
      title: "Damage protection",
      description:
        "We use photo proofs at handover to keep your items safe and secure.",
    },
    {
      title: "Rent absolutely anything",
      description:
        "From placement blazers to gorgeous party jhumkas and dresses. List it all.",
    },
  ];

  const testimonials = [
    {
      name: "Aarav, CSE 3rd Year",
      quote:
        "I rented my placement blazer three times in one month and recovered its full cost.",
    },
    {
      name: "Mehak, MBA 1st Year",
      quote:
        "I found premium event outfits without buying anything new. Super practical.",
    },
  ];

  const faqs = [
    {
      q: "Do I need Chandigarh University email to join?",
      a: "For launch, open signup is enabled. We still verify phone and ID details before first booking.",
    },
    {
      q: "How do payments work right now?",
      a: "MVP uses cash at handover and return. Online payments can be enabled in the next update.",
    },
    {
      q: "What if clothes get damaged?",
      a: "Each booking includes a security deposit and condition check at handover and return.",
    },
  ];

  return (
    <div className="red-aura min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <a href="#top" className="transition hover:opacity-90">
          <Logo />
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--muted)] md:flex">
          <a href="#how">How it works</a>
          <a href="#categories">Categories</a>
          <a href="#stories">Stories</a>
          <a href="#trust">Trust</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a
          href="#waitlist"
          className="rounded-full border border-[var(--foreground)] bg-white px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(191,18,40,0.18)]"
        >
          Join Waitlist
        </a>
      </header>

      <main
        id="top"
        className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 pb-14 sm:px-6 lg:px-8"
      >
        <section className="reveal-up">
          <div className="grid gap-8 rounded-3xl bg-[var(--surface)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] md:grid-cols-[1.35fr_1fr] md:p-10 border-none">
            <div>
              <p className="mb-5 inline-block rounded-full bg-[var(--brand-gold)] px-3 py-1 text-xs font-bold tracking-[0.14em] text-white">
                Chandigarh University Student Marketplace
              </p>
              <h1 className="heading-font text-4xl font-bold leading-tight sm:text-5xl lg:text-5xl">
                Rent out your clothes, jewellery, and accessories.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--muted)]">
                A simple student marketplace to rent dresses, jhumkas, bangles, and premium outfits for college events. Make money from what you already own.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#categories"
                  className="rounded-full border border-[var(--brand-gold)] bg-[var(--brand)] px-6 py-3 text-sm font-bold text-white shadow-[inset_0_0_8px_rgba(255,255,255,0.15)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
                >
                  Start Renting
                </a>
                <Link
                  href="/listings/new"
                  className="rounded-full border-2 border-[var(--brand-gold)] bg-transparent px-6 py-3 text-sm font-bold text-[var(--brand-gold)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(197,160,89,0.2)] hover:bg-[var(--brand-gold)] hover:text-white"
                >
                  Start Listing
                </Link>
              </div>
            </div>
            <div className="reveal-up-delay rounded-2xl border border-[var(--brand-gold)] bg-white/40 p-5 backdrop-blur-[10px] sm:p-6 shadow-sm">
              <p className="text-sm uppercase tracking-widest text-[var(--foreground)] font-semibold">Live campus snapshot</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {stats.map((item) => (
                  <li key={item.label} className="pulse-card rounded-xl border border-[var(--brand-gold)] bg-white/60 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] backdrop-blur-md">
                    <p className="font-serif text-2xl font-bold text-[var(--brand-gold)] sm:text-3xl">{item.value}</p>
                    <p className="mt-1 text-sm text-[var(--foreground)]/80 font-medium">{item.label}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="how" className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <TiltCard key={step.title} className="reveal-up h-full">
              <article className="h-full rounded-2xl border-none shadow-[0_20px_60px_rgba(0,0,0,0.05)] bg-[var(--surface)] p-6">
                <p className="heading-font text-sm font-bold text-[var(--brand)]">
                  0{index + 1}
                </p>
                <h2 className="mt-3 heading-font text-2xl font-semibold">{step.title}</h2>
                <p className="mt-3 text-[var(--muted)]">{step.description}</p>
              </article>
            </TiltCard>
          ))}
        </section>

        <section
          id="categories"
          className="rounded-3xl border-none shadow-[0_20px_60px_rgba(0,0,0,0.05)] bg-[var(--surface)] p-6 sm:p-8"
        >
          <h2 className="heading-font text-3xl font-bold sm:text-4xl">Most rented categories</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {categories.map((item) => (
              <TiltCard key={item}>
                <Link
                  href={`/listings?category=${encodeURIComponent(item)}`}
                  className="shine-card block w-full h-full rounded-xl border-none shadow-[0_20px_60px_rgba(0,0,0,0.05)] bg-white px-4 py-4 font-semibold transition hover:shadow-lg hover:-translate-y-1"
                >
                  {item}
                </Link>
              </TiltCard>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border-none shadow-[0_20px_60px_rgba(0,0,0,0.05)] bg-[var(--surface)] p-6"
            >
              <h3 className="heading-font text-2xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-[var(--muted)]">{item.description}</p>
            </article>
          ))}
        </section>

        <section id="stories" className="grid gap-4 md:grid-cols-2">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="rounded-2xl border-none shadow-[0_20px_60px_rgba(0,0,0,0.05)] bg-[var(--surface)] p-6"
            >
              <p className="text-lg leading-8 text-[var(--foreground)]">&ldquo;{item.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold tracking-wide text-[var(--brand)]">
                {item.name}
              </p>
            </article>
          ))}
        </section>

        <section id="trust" className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border-none shadow-[0_20px_60px_rgba(0,0,0,0.05)] bg-[var(--surface)] p-6">
            <h3 className="heading-font text-2xl font-semibold">Campus-first safety</h3>
            <ul className="mt-4 space-y-3 text-[var(--muted)]">
              <li>Phone verification before first booking.</li>
              <li>Handover and return checklist with photo records.</li>
              <li>Report and moderation panel for suspicious activity.</li>
            </ul>
          </div>
          <div className="rounded-2xl border-none shadow-[0_20px_60px_rgba(0,0,0,0.05)] bg-[var(--surface)] p-6">
            <h3 className="heading-font text-2xl font-semibold">Clear earning model</h3>
            <ul className="mt-4 space-y-3 text-[var(--muted)]">
              <li>You set price per day and security deposit.</li>
              <li>Cash at handover for the MVP release.</li>
              <li>Reviews improve profile trust and booking frequency.</li>
            </ul>
          </div>
        </section>

        <section id="faq" className="rounded-3xl border-none shadow-[0_20px_60px_rgba(0,0,0,0.05)] bg-[var(--surface)] p-6 sm:p-8">
          <h2 className="heading-font text-3xl font-bold">Frequently asked questions</h2>
          <div className="mt-6 space-y-3">
            {faqs.map((item) => (
              <details key={item.q} className="rounded-xl border-none shadow-[0_20px_60px_rgba(0,0,0,0.05)] bg-white p-4">
                <summary className="cursor-pointer font-semibold">{item.q}</summary>
                <p className="mt-2 text-[var(--muted)]">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="waitlist" className="rounded-3xl bg-[var(--brand)] p-8 text-white sm:p-10">
          <p className="text-sm uppercase tracking-[0.2em] text-white/80">Launch in progress</p>
          <h2 className="heading-font mt-3 text-3xl font-bold sm:text-4xl">
            Be first to join DivineBridge at Chandigarh University.
          </h2>
          <p className="mt-4 max-w-2xl text-white/85">
            Rent out your outfits, jewellery, and accessories. Stop buying full new sets for every one-time event!
          </p>
          <p className="mt-2 text-sm text-white/80">
            Waitlist email is for launch updates only. To create a profile, use Create Account.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/auth/signup" className="rounded-full bg-white px-5 py-2 text-sm font-bold text-[var(--brand)]">
              Create Account
            </Link>
            <Link href="/auth/signin" className="rounded-full border border-white/60 px-5 py-2 text-sm font-semibold text-white">
              Sign In
            </Link>
            <Link href="/profile" className="rounded-full border border-white/60 px-5 py-2 text-sm font-semibold text-white">
              My Profile
            </Link>
          </div>
          <WaitlistForm />
        </section>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-4 pb-10 text-sm text-[var(--muted)] sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p>DivineBridge 2026. Built for student wardrobes and smarter spending.</p>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/terms">Terms &amp; Conditions</Link>
            <Link href="/policy">Policy</Link>
          </div>
        </div>
        <p className="mt-3 text-xs">
          Disclaimer: DivineBridge is only a bridge platform between owners and renters. We are not liable for loss, theft,
          damage, injury, or any dispute arising from offline handover, use, return, or condition of items.
        </p>
      </footer>
    </div>
  );
}
