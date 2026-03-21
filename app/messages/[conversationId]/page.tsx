"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";

type ConversationData = {
  id: string;
  listing: { id: string; title: string };
  messages: { id: string; senderId: string; content: string; createdAt: string }[];
};

export default function ConversationPage({ params }: { params: { conversationId: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const loadConversation = useCallback(async () => {
    const response = await fetch(`/api/messages/${params.conversationId}`, { cache: "no-store" }).catch(() => null);

    if (!response) {
      setError("Network issue.");
      setLoading(false);
      return;
    }

    const body = (await response.json().catch(() => ({}))) as {
      error?: string;
      conversation?: ConversationData;
    };

    if (!response.ok) {
      setError(body.error ?? "Could not load conversation.");
      setLoading(false);
      return;
    }

    setConversation(body.conversation ?? null);
    setLoading(false);
  }, [params.conversationId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadConversation();
  }, [loadConversation]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);

    const response = await fetch(`/api/messages/${params.conversationId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    }).catch(() => null);

    setSending(false);

    if (!response) {
      setError("Network issue.");
      return;
    }

    const body = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      setError(body.error ?? "Could not send message.");
      return;
    }

    setContent("");
    setError("");
    void loadConversation();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-12">
      <h1 className="heading-font text-3xl font-bold">Conversation</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {conversation ? `Listing: ${conversation.listing.title}` : "Loading listing conversation..."}
      </p>

      {loading ? <p className="mt-6 text-sm text-[var(--muted)]">Loading...</p> : null}
      {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}

      <div className="mt-6 grid gap-3">
        {conversation?.messages.map((item) => (
          <div key={item.id} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3">
            <p className="text-sm">{item.content}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {new Date(item.createdAt).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      <form className="mt-6 grid gap-3" onSubmit={onSubmit}>
        <textarea
          required
          minLength={2}
          rows={4}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Reply..."
          className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3"
        />
        <button
          type="submit"
          disabled={sending}
          className="w-fit rounded-xl bg-[var(--brand)] px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>

      <Link href="/messages" className="mt-6 inline-block text-sm font-semibold text-[var(--brand)]">
        Back to messages
      </Link>
    </main>
  );
}
