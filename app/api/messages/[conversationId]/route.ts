import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const replySchema = z.object({
  content: z.string().trim().min(2).max(2000),
});

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        listing: {
          select: {
            id: true,
            title: true,
          },
        },
        participantAId: true,
        participantBId: true,
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
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            senderId: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }

    if (
      conversation.participantAId !== session.user.id &&
      conversation.participantBId !== session.user.id
    ) {
      return NextResponse.json({ error: "Not allowed." }, { status: 403 });
    }

    return NextResponse.json({ conversation });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
      return NextResponse.json(
        { error: "Messaging tables are not ready. Apply latest SQL migration in Supabase." },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "Could not load conversation." }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = replySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid message." }, { status: 400 });
  }

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        participantAId: true,
        participantBId: true,
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }

    if (
      conversation.participantAId !== session.user.id &&
      conversation.participantBId !== session.user.id
    ) {
      return NextResponse.json({ error: "Not allowed." }, { status: 403 });
    }

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: session.user.id,
        content: parsed.data.content,
      },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: "Message sent." }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
      return NextResponse.json(
        { error: "Messaging tables are not ready. Apply latest SQL migration in Supabase." },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "Could not send reply." }, { status: 500 });
  }
}
