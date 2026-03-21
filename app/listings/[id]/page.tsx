'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Review {
  name: string;
  rating: number;
  text: string;
}

interface Listing {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
  owner: string;
  rating: number;
  size: string;
  condition: string;
  description: string;
  details: string[];
  reviews: Review[];
}

const sampleListings: Record<string, Listing> = {
  '1': {
    id: '1',
    title: 'Premium Party Dress',
    category: 'Fresher party fits',
    price: 300,
    image: 'https://images.unsplash.com/photo-1595777707802-221fbe16d3d6?w=800&h=600&fit=crop',
    owner: 'Sarah K.',
    rating: 4.8,
    size: 'M',
    condition: 'Like New',
    description: 'Beautiful party dress perfect for fresher events. Worn once, well maintained. Includes matching clutch.',
    details: ['Size M', 'Red color', 'Polyester blend', 'Comes with clutch'],
    reviews: [
      { name: 'Aarav', rating: 5, text: 'Perfect fit and beautiful dress!' },
      { name: 'Priya', rating: 4, text: 'Great quality, quick handover.' },
    ],
  },
  '2': {
    id: '2',
    title: 'Formal Blazer Set',
    category: 'Placement formalwear',
    price: 500,
    image: 'https://images.unsplash.com/photo-1591047990508-42b0d0f99290?w=800&h=600&fit=crop',
    owner: 'Arjun M.',
    rating: 5,
    size: 'L',
    condition: 'Excellent',
    description: 'Professional blazer with matching trousers. Perfect for placement interviews and corporate events.',
    details: ['Size L', 'Navy blue', 'Premium cotton', 'Set of 2 pieces'],
    reviews: [
      { name: 'Vikram', rating: 5, text: 'Perfect for my placement interview!' },
      { name: 'Rahul', rating: 5, text: 'Excellent quality.' },
    ],
  },
  '3': {
    id: '3',
    title: 'Black Evening Gown',
    category: 'Wedding and fest sets',
    price: 800,
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&h=600&fit=crop',
    owner: 'Priya S.',
    rating: 4.9,
    size: 'S',
    condition: 'Like New',
    description: 'Elegant black gown for weddings and formal events. Designer piece, barely worn.',
    details: ['Size S', 'Black', 'Silk', 'Designer brand'],
    reviews: [
      { name: 'Meera', rating: 5, text: 'Absolutely stunning!' },
      { name: 'Zara', rating: 4, text: 'Beautiful gown, very elegant.' },
    ],
  },
  '4': {
    id: '4',
    title: 'Gym Wear Bundle',
    category: 'Athleisure drops',
    price: 200,
    image: 'https://images.unsplash.com/photo-1506629082847-11d52bcbb743?w=800&h=600&fit=crop',
    owner: 'Rohan D.',
    rating: 4.7,
    size: 'M',
    condition: 'Good',
    description: 'Complete gym wear set including leggings, sports bra, and top. Comfortable and stylish.',
    details: ['Size M', 'Black and grey', 'Polyester', '3 pieces included'],
    reviews: [
      { name: 'Divya', rating: 4, text: 'Comfortable and stretchy!' },
    ],
  },
  '5': {
    id: '5',
    title: 'Club Outfit - Sequin Top',
    category: 'Club night looks',
    price: 400,
    image: 'https://images.unsplash.com/photo-1595959915551-a1be02aea4c0?w=800&h=600&fit=crop',
    owner: 'Zara P.',
    rating: 4.6,
    size: 'XS',
    condition: 'Like New',
    description: 'Sparkling sequin top perfect for club nights. Pairs well with black pants or skirts.',
    details: ['Size XS', 'Gold sequin', 'Polyester', 'Fitted cut'],
    reviews: [
      { name: 'Ananya', rating: 5, text: 'So glamorous!' },
    ],
  },
  '6': {
    id: '6',
    title: 'Winter Jacket',
    category: 'Winter layering',
    price: 600,
    image: 'https://images.unsplash.com/photo-1539533057440-7a8fe1ac0f3f?w=800&h=600&fit=crop',
    owner: 'Vikram T.',
    rating: 4.9,
    size: 'L',
    condition: 'Excellent',
    description: 'Premium winter jacket, waterproof and warm. Perfect for harsh winters.',
    details: ['Size L', 'Black', 'Wool blend', 'Waterproof'],
    reviews: [
      { name: 'Rohan', rating: 5, text: 'Very warm and comfortable!' },
      { name: 'Ishan', rating: 4, text: 'Excellent quality jacket.' },
    ],
  },
};

export default function ListingDetail({ params }: { params: { id: string } }) {
  const listing = sampleListings[params.id];
  const [submitted, setSubmitted] = useState(false);

  if (!listing) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/" className="heading-font flex items-center gap-2 text-2xl font-bold">
            DIVINEBRIDGE
          </Link>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-lg text-[var(--muted)]">Listing not found.</p>
          <Link href="/listings" className="mt-4 inline-block text-[var(--brand)] font-semibold">
            ← Back to listings
          </Link>
        </main>
      </div>
    );
  }

  const handleRequest = async () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" className="heading-font flex items-center gap-2 text-2xl font-bold">
          DIVINEBRIDGE
        </Link>
        <Link href="/listings" className="text-sm font-semibold text-[var(--brand)]">
          ← Back to listings
        </Link>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <img
              src={listing.image}
              alt={listing.title}
              className="rounded-2xl border border-[var(--line)] object-cover w-full h-96"
            />
          </div>

          <div>
            <p className="inline-block rounded-full bg-[var(--brand)] px-3 py-1 text-xs font-bold text-white">
              {listing.category}
            </p>
            <h1 className="heading-font mt-4 text-4xl font-bold">{listing.title}</h1>
            
            <div className="mt-4 flex items-center gap-4">
              <div>
                <p className="heading-font text-3xl font-bold">Rs {listing.price}</p>
                <p className="text-sm text-[var(--muted)]">per day</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[var(--brand)]">★ {listing.rating}</span>
                <span className="text-sm text-[var(--muted)]">(based on reviews)</span>
              </div>
            </div>

            <p className="mt-6 text-lg leading-8 text-[var(--foreground)]">{listing.description}</p>

            <div className="mt-6 space-y-3">
              <h3 className="heading-font font-semibold">Details:</h3>
              <ul className="space-y-2">
                {listing.details.map((detail, i) => (
                  <li key={i} className="flex items-center gap-2 text-[var(--muted)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--brand)]" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-2">Owner</label>
                <p className="text-[var(--muted)]">{listing.owner}</p>
              </div>
              
              {!submitted ? (
                <button
                  onClick={handleRequest}
                  className="w-full rounded-xl bg-[var(--brand)] px-6 py-3 text-lg font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Send Rental Request
                </button>
              ) : (
                <div className="w-full rounded-xl border-2 border-green-500 bg-green-50 px-6 py-3 text-center font-semibold text-green-700">
                  ✓ Request sent to {listing.owner}!
                </div>
              )}
            </div>
          </div>
        </div>

        {listing.reviews.length > 0 && (
          <div className="mt-12">
            <h2 className="heading-font text-2xl font-bold">Reviews</h2>
            <div className="mt-4 grid gap-4">
              {listing.reviews.map((review, i) => (
                <div key={i} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-[var(--brand)]">★ {review.rating}</p>
                  </div>
                  <p className="mt-2 text-[var(--muted)]">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
