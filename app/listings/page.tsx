'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

const categories = [
  'Fresher party fits',
  'Placement formalwear',
  'Club night looks',
  'Athleisure drops',
  'Wedding and fest sets',
  'Winter layering',
];

const sampleListings = [
  {
    id: '1',
    title: 'Premium Party Dress',
    category: 'Fresher party fits',
    price: 300,
    image: 'https://images.unsplash.com/photo-1595777707802-221fbe16d3d6?w=500&h=500&fit=crop',
    owner: 'Sarah K.',
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Formal Blazer Set',
    category: 'Placement formalwear',
    price: 500,
    image: 'https://images.unsplash.com/photo-1591047990508-42b0d0f99290?w=500&h=500&fit=crop',
    owner: 'Arjun M.',
    rating: 5,
  },
  {
    id: '3',
    title: 'Black Evening Gown',
    category: 'Wedding and fest sets',
    price: 800,
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&h=500&fit=crop',
    owner: 'Priya S.',
    rating: 4.9,
  },
  {
    id: '4',
    title: 'Gym Wear Bundle',
    category: 'Athleisure drops',
    price: 200,
    image: 'https://images.unsplash.com/photo-1506629082847-11d52bcbb743?w=500&h=500&fit=crop',
    owner: 'Rohan D.',
    rating: 4.7,
  },
  {
    id: '5',
    title: 'Club Outfit - Sequin Top',
    category: 'Club night looks',
    price: 400,
    image: 'https://images.unsplash.com/photo-1595959915551-a1be02aea4c0?w=500&h=500&fit=crop',
    owner: 'Zara P.',
    rating: 4.6,
  },
  {
    id: '6',
    title: 'Winter Jacket',
    category: 'Winter layering',
    price: 600,
    image: 'https://images.unsplash.com/photo-1539533057440-7a8fe1ac0f3f?w=500&h=500&fit=crop',
    owner: 'Vikram T.',
    rating: 4.9,
  },
];

function ListingsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const filtered = category
    ? sampleListings.filter((item) => item.category === category)
    : sampleListings;

  return (
    <>
      <div className="mb-8">
        <h1 className="heading-font text-4xl font-bold">Browse Listings</h1>
        <p className="mt-2 text-[var(--muted)]">
          {category ? `Showing ${filtered.length} items in "${category}"` : `Showing all ${filtered.length} listings`}
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/listings"
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            !category
              ? 'bg-[var(--brand)] text-white'
              : 'border border-[var(--line)] hover:bg-[var(--surface)]'
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
                ? 'bg-[var(--brand)] text-white'
                : 'border border-[var(--line)] hover:bg-[var(--surface)]'
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-12 text-center">
          <p className="text-lg text-[var(--muted)]">No listings found in this category.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((listing) => (
            <Link
              key={listing.id}
              href={`/listings/${listing.id}`}
              className="group rounded-2xl border border-[var(--line)] bg-[var(--surface)] overflow-hidden transition hover:shadow-lg hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden bg-[var(--background)]">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="heading-font font-semibold line-clamp-2">{listing.title}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{listing.owner}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="heading-font text-lg font-bold">Rs {listing.price}</p>
                    <p className="text-xs text-[var(--muted)]">per day</p>
                  </div>
                  <div className="text-right">
                    <p className="heading-font font-semibold text-[var(--brand)]">★ {listing.rating}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default function ListingsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" className="heading-font flex items-center gap-2 text-2xl font-bold tracking-tight">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-white">
            <svg viewBox="0 0 72 72" className="h-7 w-7 text-[var(--brand)]" fill="none">
              <circle cx="36" cy="14" r="8" stroke="currentColor" strokeWidth="4" />
              <path d="M24 24H48" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M20 40C26 31 46 31 52 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M26 48L36 60L46 48" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M36 24V34" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </span>
          DIVINEBRIDGE
        </Link>
        <Link href="/#waitlist" className="rounded-full border border-[var(--foreground)] bg-white px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5">
          Join Waitlist
        </Link>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-center py-10">Loading listings...</div>}>
          <ListingsContent />
        </Suspense>
      </main>
    </div>
  );
}
