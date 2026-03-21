"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState, use, useRef } from "react";

type Participant = { id: string; name: string | null; email: string | null };

type ConversationData = {
  id: string;
  listing: { id: string; title: string };
  participantA: Participant;
  participantB: Participant;
  messages: { id: string; senderId: string; content: string; createdAt: string }[];
};

export default function ConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const unwrappedParams = use(params);
  const conversationId = unwrappedParams.conversationId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadConversation = useCallback(async () => {
    const response = await fetch(`/api/messages/${conversationId}`, { cache: "no-store" }).catch(() => null);

    if (!response) {
      setError("Network issue.");
      setLoading(false);
      return;
    }

    const body = (await response.json().catch(() => ({}))) as {
      error?: string;
      conversation?: ConversationData;
      myId?: string;
    };

    if (!response.ok) {
      setError(body.error ?? "Could not load conversation.");
      setLoading(false);
      return;
    }

    setConversation(body.conversation ?? null);
    setMyId(body.myId ?? null);
    setLoading(false);
  }, [conversationId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadConversation();
  }, [loadConversation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation?.messages]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim()) return;

    setSending(true);

    const response = await fetch(`/api/messages/${conversationId}`, {
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

  const otherParticipant = conversation 
    ? (conversation.participantA.id === myId ? conversation.participantB : conversation.participantA)
    : null;

  return (
    <main className="mx-auto flex h-dvh w-full max-w-4xl flex-col bg-[var(--background)] px-4 py-8 shadow-2xl shadow-[var(--line)]">
      <Link href="/messages" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)] transition hover:opacity-75">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back to Inbox
      </Link>

      <div className="mb-6 flex items-center gap-4 rounded-b-3xl border-b border-[var(--line)] bg-white pb-6 pt-2">
        {otherParticipant ? (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffcccc] text-xl font-bold text-[#cc0000] shadow-sm">
            {(otherParticipant.name || "U")[0].toUpperCase()}
          </div>
        ) : (
          <div className="h-12 w-12 rounded-full bg-[#ffcccc] animate-pulse" />
        )}
        <div>
          <h1 className="heading-font text-2xl font-bold tracking-tight text-[var(--foreground)]">
            {otherParticipant?.name ?? "Loading..."}
          </h1>
          <p className="mt-1 text-xs font-medium text-[var(--muted)]">
            {conversation ? `Details: ${conversation.listing.title}` : "Fetching details..."}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2" ref={scrollRef}>
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--line)] border-t-[var(--brand)]" />
          </div>
        ) : null}

        {error ? (
          <div className="my-8 rounded-2xl bg-[#fff0f0] p-4 text-center text-sm font-semibold text-[#cc0000]">
            {error}
          </div>
        ) : null}

        <div className="flex flex-col gap-4 py-4">
          {conversation?.messages.map((item) => {
            const isMe = item.senderId === myId;
            return (
              <div
                key={item.id}
                className={`flex w-full ${isMe ? "justify-end slide-in-right" : "justify-start slide-in-left"}`}
              >
                <div
                  className={`relative max-w-[80%] rounded-2xl px-5 py-3 shadow-sm sm:max-w-[#70%] ${
                    isMe
                      ? "rounded-br-sm bg-[var(--brand)] text-white shadow-[#ff0000]/20"
                      : "rounded-bl-sm border border-[var(--line)] bg-white text-[var(--foreground)]"
                  }`}
                >
                  <p className="text-[15px] leading-relaxed tracking-wide">{item.content}</p>
                  <p
                    className={`mt-1.5 text-[10px] font-medium tracking-wider ${
                      isMe ? "text-white/70" : "text-[var(--muted)]"
                    }`}
                  >
                    {new Date(item.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <form className="mt-4 flex flex-col gap-3 rounded-3xl border border-[var(--line)] bg-white p-2 shadow-lg sm:flex-row sm:p-3" onSubmit={onSubmit}>
        <input
          type="text"
          required
          minLength={2}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Message..."
          className="flex-1 rounded-2xl bg-transparent px-4 py-3 text-[15px] text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:bg-[#fff9f8]"
        />
        <button
          type="submit"
          disabled={sending || !content.trim()}
          className="flex items-center justify-center rounded-2xl bg-[var(--brand)] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-[var(--brand)]/30 disabled:pointer-events-none disabled:opacity-50"
        >
          {sending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            "Send"
          )}
        </button>
      </form>
    </main>
  );
}
