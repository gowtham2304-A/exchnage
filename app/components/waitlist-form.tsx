"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!consent) {
      setStatus("error");
      setMessage("Please accept Terms and Policy before joining.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(result.message ?? "Could not join waitlist. Please try again.");
        return;
      }

      setStatus("success");
      setMessage((result.message ?? "You are on the waitlist.") + " Create account from the button above to set up your profile.");
      setEmail("");
      setConsent(false);
    } catch {
      setStatus("error");
      setMessage("Network issue. Please try again.");
    }
  }

  return (
    <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={onSubmit} noValidate>
      <div className="w-full">
        <input
          type="email"
          placeholder="Enter email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-full border border-white/30 bg-white px-5 py-3 text-[var(--foreground)] outline-none"
        />
        <label className="mt-3 flex items-start gap-2 text-xs text-white/90">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-white/40"
          />
          <span>
            I agree to the <a href="/terms" className="underline">Terms</a> and <a href="/policy" className="underline">Policy</a>.
            DivineBridge acts only as a bridge platform and is not responsible for any damage, loss, or disputes.
          </span>
        </label>
        {status !== "idle" && (
          <p className="mt-2 text-xs text-white/95" role="status" aria-live="polite">
            {message}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-[var(--brand-deep)] px-6 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? "Submitting..." : "Get Early Access"}
      </button>
    </form>
  );
}