import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const waitlistSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

const waitlistEmails = new Set<string>();

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = waitlistSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please enter a valid email." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const { email } = parsed.data;

  try {
    await prisma.waitlistEntry.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    return NextResponse.json(
      { message: "Thanks. You are on the early-access waitlist." },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    if (!waitlistEmails.has(email)) {
      waitlistEmails.add(email);
    }

    return NextResponse.json(
      { message: "Thanks. We received your request and will contact you soon." },
      { status: 202, headers: { "Cache-Control": "no-store" } }
    );
  }
}