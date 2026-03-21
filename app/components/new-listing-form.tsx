"use client";

import { ListingCondition } from "@prisma/client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type SubmitState = "idle" | "submitting" | "success" | "error";

const conditions: ListingCondition[] = ["NEW", "LIKE_NEW", "GOOD", "FAIR"];

export type InitialListingData = {
  title: string;
  description: string;
  category: string;
  size: string;
  condition: ListingCondition;
  pricePer24Hours: string;
  securityDeposit: string;
  location: string;
  imageUrl: string;
};

type Props = {
  listingId?: string;
  initialData?: InitialListingData;
};

export default function NewListingForm({ listingId, initialData }: Props = {}) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [size, setSize] = useState(initialData?.size || "");
  const [condition, setCondition] = useState<ListingCondition>(initialData?.condition || "LIKE_NEW");
  const [pricePer24Hours, setPricePer24Hours] = useState(initialData?.pricePer24Hours || "");
  const [securityDeposit, setSecurityDeposit] = useState(initialData?.securityDeposit || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadMessage, setImageUploadMessage] = useState("");

  const [status, setStatus] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function uploadImageFile(file: File) {
    setImageUploading(true);
    setImageUploadMessage("");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/uploads/listing-image", {
      method: "POST",
      body: formData,
    }).catch(() => null);

    if (!response) {
      setImageUploading(false);
      setImageUploadMessage("Image upload failed due to network issue.");
      return;
    }

    const body = (await response.json().catch(() => ({}))) as {
      error?: string;
      imageUrl?: string;
    };

    if (!response.ok || !body.imageUrl) {
      setImageUploading(false);
      setImageUploadMessage(body.error ?? "Image upload failed.");
      return;
    }

    setImageUrl(body.imageUrl);
    setImageUploadMessage("Image uploaded successfully.");
    setImageUploading(false);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (imageUploading) {
      setStatus("error");
      setMessage("Please wait for image upload to finish.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    const url = listingId ? `/api/listings/${listingId}` : "/api/listings";
    const method = listingId ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
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
    setMessage(body.message ?? (listingId ? "Item updated successfully." : "Item listed successfully."));

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

      <div className="grid gap-2">
        <label className="block text-sm font-semibold">Upload image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              void uploadImageFile(file);
            }
          }}
          className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3"
        />
        {imageUrl ? (
          <div className="rounded-xl border border-[var(--line)] bg-white p-3">
            <img src={imageUrl} alt="Uploaded preview" className="h-40 w-full rounded-lg object-cover" />
          </div>
        ) : null}
        {imageUploadMessage ? (
          <p className={`text-sm ${imageUploadMessage.includes("success") ? "text-green-700" : "text-red-600"}`}>
            {imageUploadMessage}
          </p>
        ) : null}
      </div>

      {status !== "idle" ? (
        <p className={`text-sm ${status === "error" ? "text-red-600" : "text-green-700"}`} role="status" aria-live="polite">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting" || imageUploading}
        className="rounded-xl bg-[var(--brand)] px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {imageUploading ? "Uploading image..." : status === "submitting" ? (listingId ? "Updating..." : "Listing item...") : (listingId ? "Update Listing" : "List Item")}
      </button>
    </form>
  );
}
