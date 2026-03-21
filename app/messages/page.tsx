"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ConversationRow = {
  id: string;
  listing: { id: string; title: string };
  participantA: { id: string; name: string | null; email: string | null };
  participantB: { id: string; name: string | null; email: string | null };
  messages: { content: string; createdAt: string; senderId: string }[];
};

export default function MessagesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [conversations, setConversations] = useState<ConversationRow[]>([]);

  useEffect(() => {
    async function loadConversations() {
      const response = await fetch("/api/messages", { cache: "no-store" }).catch(() => null);

      if (!response) {
        setLoading(false);
        setError("Network issue. Could not load messages.");
        return;
      }

      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
        conversations?: ConversationRow[];
      };

      if (!response.ok) {
        setLoading(false);
        setError(body.error ?? "Could not load conversations.");
        return;
      }

      setConversations(body.conversations ?? []);
      setLoading(false);
    }

    void loadConversations();
  }, []);

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-12">
      <h1 className="heading-font text-4xl font-bold">Messages</h1>
      <p className="mt-2 text-[var(--muted)]">Chat with listing owners and renters.</p>

      {loading ? <p className="mt-6 text-sm text-[var(--muted)]">Loading...</p> : null}
      {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}

      {!loading && !error && conversations.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">
          No conversations yet.
        </div>
      ) : null}

      <div className="mt-6 grid gap-3">
        {conversations.map((conversation) => {
          const latest = conversation.messages[0];
          return (
            <Link
              key={conversation.id}
              href={`/messages/${conversation.id}`}
              className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 transition hover:-translate-y-0.5"
            >
              <p className="heading-font text-lg font-semibold">{conversation.listing.title}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {latest ? latest.content : "No messages yet"}
              </p>
            </Link>
          );
        })}
      </div>

      <Link href="/" className="mt-8 inline-block text-sm font-semibold text-[var(--brand)]">
        Back to home
      </Link>
    </main>
  );
}
