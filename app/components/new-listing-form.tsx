"use client";

import { ListingCondition } from "@prisma/client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type SubmitState = "idle" | "submitting" | "success" | "error";

const conditions: ListingCondition[] = ["NEW", "LIKE_NEW", "GOOD", "FAIR"];

export default function NewListingForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState<ListingCondition>("LIKE_NEW");
  const [pricePer24Hours, setPricePer24Hours] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [status, setStatus] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const response = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        category,
        size,
        condition,
        pricePer24Hours,
        securityDeposit: securityDeposit || undefined,
        location,
        imageUrl,
      }),
    }).catch(() => null);

    if (!response) {
      setStatus("error");
      setMessage("Network error. Please try again.");
      return;
    }

    const body = (await response.json().catch(() => ({}))) as {
      error?: string;
      message?: string;
      id?: string;
    };

    if (!response.ok) {
      setStatus("error");
      setMessage(body.error ?? "Could not create listing.");
      return;
    }

    setStatus("success");
    setMessage(body.message ?? "Item listed successfully.");

    if (body.id) {
      setTimeout(() => router.push(`/listings/${body.id}`), 700);
    }
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={onSubmit} noValidate>
      <input
        type="text"
        required
        minLength={3}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Item title"
        className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3"
      />

      <textarea
        required
        minLength={20}
        rows={5}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Item description"
        className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          required
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="Category"
          className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3"
        />

        <input
          type="text"
          required
          value={size}
          onChange={(event) => setSize(event.target.value)}
          placeholder="Size (S/M/L/XL etc.)"
          className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <select
          value={condition}
          onChange={(event) => setCondition(event.target.value as ListingCondition)}
          className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3"
        >
          {conditions.map((item) => (
            <option key={item} value={item}>
              {item.replaceAll("_", " ")}
            </option>
          ))}
        </select>

        <input
          type="text"
          required
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Location"
          className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold">Price for 24 hours (Rs)</label>
          <input
            type="number"
            required
            min="1"
            step="0.01"
            value={pricePer24Hours}
            onChange={(event) => setPricePer24Hours(event.target.value)}
            placeholder="e.g. 350"
            className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">Security deposit (Rs) (optional)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={securityDeposit}
            onChange={(event) => setSecurityDeposit(event.target.value)}
            placeholder="Defaults to 24-hour price"
            className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3"
          />
        </div>
      </div>

      <input
        type="url"
        value={imageUrl}
        onChange={(event) => setImageUrl(event.target.value)}
        placeholder="Image URL (optional)"
        className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3"
      />

      {status !== "idle" ? (
        <p className={`text-sm ${status === "error" ? "text-red-600" : "text-green-700"}`} role="status" aria-live="polite">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-xl bg-[var(--brand)] px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {status === "submitting" ? "Listing item..." : "List Item"}
      </button>
    </form>
  );
}
