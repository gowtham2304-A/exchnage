"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const callbackUrl = "/profile";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setSubmitting(false);

    if (!result || result.error) {
      setMessage("Invalid email or password.");
      return;
    }

    router.push(result.url || callbackUrl);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-12">
      <h1 className="heading-font text-3xl font-bold">Sign In</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Access your profile and start listing products.</p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
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
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-4 text-sm text-[var(--muted)]">
        New user? <Link href="/auth/signup" className="font-semibold text-[var(--brand)]">Create account</Link>
      </p>
      <Link href="/" className="mt-4 text-sm font-semibold text-[var(--brand)]">Back to home</Link>
    </main>
  );
}
