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
  const [myId, setMyId] = useState<string | null>(null);

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
        myId?: string;
      };

      if (!response.ok) {
        setLoading(false);
        setError(body.error ?? "Could not load conversations.");
        return;
      }

      setConversations(body.conversations ?? []);
      setMyId(body.myId ?? null);
      setLoading(false);
    }

    void loadConversations();
  }, []);

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-12">
      <div className="mb-10 flex items-center justify-between reveal-up">
        <div>
          <h1 className="heading-font text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Inbox</h1>
          <p className="mt-2 text-sm font-medium text-[var(--muted)]">View and manage your conversations</p>
        </div>
        <Link href="/" className="flex h-10 items-center justify-center rounded-full bg-[var(--line)] px-4 text-sm font-bold text-[var(--brand-deep)] transition hover:bg-[#ffdbd4]">
          Back
        </Link>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--line)] border-t-[var(--brand)]" />
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl bg-[#fff4f2] p-4 text-center text-sm font-semibold text-[#cc2000]">
          {error}
        </div>
      ) : null}

      {!loading && !error && conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--line)] bg-[#fff9f8] py-20 text-center reveal-up-delay">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm mb-4 text-[var(--brand)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/><circle cx="9" cy="9" r="2"/><path d="M21 15V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/></svg>
          </div>
          <p className="text-lg font-bold text-[var(--foreground)]">It&apos;s quiet here...</p>
          <p className="mt-2 max-w-xs text-sm text-[var(--muted)]">You don&apos;t have any completely empty or active messages right now.</p>
        </div>
      ) : null}

      <div className="grid gap-4">
        {conversations.map((conversation, i) => {
          const latest = conversation.messages[0];
          const otherParticipant = conversation.participantA.id === myId ? conversation.participantB : conversation.participantA;
          const isLatestMine = latest?.senderId === myId;
          
          return (
            <Link
              key={conversation.id}
              href={`/messages/${conversation.id}`}
              className="group flex flex-col gap-4 sm:flex-row sm:items-center rounded-3xl border border-[var(--line)] bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--line)] reveal-up"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <div className="flex flex-1 items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#ffdbd4] font-bold text-xl text-[#cc2000] group-hover:bg-[var(--brand)] group-hover:text-white transition-colors">
                  {(otherParticipant.name || "U")[0].toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h2 className="truncate text-lg font-bold text-[var(--foreground)]">
                      {otherParticipant.name || "Unknown"}
                    </h2>
                    {latest && (
                      <span className="shrink-0 text-[11px] font-semibold text-[var(--muted)]">
                        {new Date(latest.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs font-semibold uppercase tracking-wider text-[var(--brand)] mb-1">
                    {conversation.listing.title}
                  </p>
                  <p className="truncate text-sm text-[var(--muted)]">
                    {latest ? (
                      <span className="flex items-center gap-1.5">
                        {isLatestMine && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--brand)]"><path d="m5 12 5 5L20 7"/></svg>
                        )}
                        {latest.content}
                      </span>
                    ) : "No messages yet"}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
