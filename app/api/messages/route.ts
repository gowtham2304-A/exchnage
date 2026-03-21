import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createMessageSchema = z.object({
  listingId: z.string().trim().min(1),
  recipientId: z.string().trim().min(1),
  content: z.string().trim().min(2).max(2000),
});

function orderParticipants(userA: string, userB: string) {
  return userA < userB ? [userA, userB] : [userB, userA];
}

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { participantAId: session.user.id },
          { participantBId: session.user.id },
        ],
      },
      select: {
        id: true,
        updatedAt: true,
        listing: {
          select: {
            id: true,
            title: true,
          },
        },
        participantA: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        participantB: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            content: true,
            createdAt: true,
            senderId: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ conversations, myId: session.user.id });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
      return NextResponse.json(
        { error: "Messaging tables are not ready. Apply latest SQL migration in Supabase." },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "Could not load conversations." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = createMessageSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const { listingId, recipientId, content } = parsed.data;

  if (recipientId === session.user.id) {
    return NextResponse.json({ error: "You cannot message yourself." }, { status: 400 });
  }

  try {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, ownerId: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }

    if (listing.ownerId !== recipientId) {
      return NextResponse.json({ error: "Recipient does not match listing owner." }, { status: 400 });
    }

    const [participantAId, participantBId] = orderParticipants(session.user.id, recipientId);

    const conversation = await prisma.conversation.upsert({
      where: {
        listingId_participantAId_participantBId: {
          listingId,
          participantAId,
          participantBId,
        },
      },
      update: {
        updatedAt: new Date(),
      },
      create: {
        listingId,
        participantAId,
        participantBId,
      },
      select: {
        id: true,
      },
    });

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: session.user.id,
        content,
      },
    });

    return NextResponse.json({ success: true, conversationId: conversation.id, message: "Message sent." }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
      return NextResponse.json(
        { error: "Messaging tables are not ready. Apply latest SQL migration in Supabase." },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "Could not send message." }, { status: 500 });
  }
}
