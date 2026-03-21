"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const body = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      setSubmitting(false);
      setMessage(body.error ?? "Could not create account.");
      return;
    }

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/profile",
    });

    setSubmitting(false);

    if (!signInResult || signInResult.error) {
      setMessage("Account created. Please sign in.");
      router.push("/auth/signin");
      return;
    }

    router.push(signInResult.url || "/profile");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-12">
      <h1 className="heading-font text-3xl font-bold">Create Account</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Create your profile to list products and manage rentals.</p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <input
          type="text"
          required
          minLength={2}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Full name"
          className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3"
        />
        <input
          type="password"
          required
          minLength={10}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3"
        />

        {message ? <p className="text-sm text-red-600">{message}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-[var(--brand)] px-4 py-3 font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-4 text-sm text-[var(--muted)]">
        Already have an account? <Link href="/auth/signin" className="font-semibold text-[var(--brand)]">Sign in</Link>
      </p>
      <Link href="/" className="mt-4 text-sm font-semibold text-[var(--brand)]">Back to home</Link>
    </main>
  );
}
