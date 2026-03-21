"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  listingId: string;
  recipientId: string;
};

export default function ListingMessageBox({ listingId, recipientId }: Props) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, recipientId, content }),
    }).catch(() => null);

    setSubmitting(false);

    if (!response) {
      setMessage("Network issue. Please try again.");
      return;
    }

    const body = (await response.json().catch(() => ({}))) as {
      error?: string;
      conversationId?: string;
    };

    if (!response.ok) {
      setMessage(body.error ?? "Could not send message.");
      return;
    }

    if (body.conversationId) {
      router.push(`/messages/${body.conversationId}`);
      return;
    }

    setMessage("Message sent.");
    setContent("");
  }

  return (
    <div className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
      <h2 className="heading-font text-xl font-semibold">Message Owner In-App</h2>
      <form className="mt-3 grid gap-3" onSubmit={onSubmit}>
        <textarea
          required
          minLength={2}
          rows={4}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write your message..."
          className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3"
        />
        {message ? (
          <p className="text-sm text-[var(--brand)]" role="status" aria-live="polite">
            {message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="w-fit rounded-xl bg-[var(--brand)] px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
