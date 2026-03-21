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
    <div className="mt-16 pt-12 border-t border-[var(--line)]">
      <h2 className="heading-font text-[13px] font-bold uppercase tracking-[0.2em] mb-6 text-[var(--foreground)]">Direct Message</h2>
      <form className="grid gap-6" onSubmit={onSubmit}>
        <textarea
          required
          minLength={2}
          rows={3}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="I'm interested in renting this for an upcoming event..."
          className="w-full resize-none border-b border-[var(--line)] bg-transparent py-4 text-sm outline-none placeholder:text-[var(--muted)] focus:border-black transition-colors"
        />
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={submitting}
            className="flex h-12 items-center justify-center bg-black px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[var(--brand)] disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Send Request"}
          </button>
          {message ? (
            <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--brand)]" role="status" aria-live="polite">
              {message}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
