import { ListingCondition, ListingStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createListingSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(20).max(3000),
  category: z.string().trim().min(2).max(60),
  size: z.string().trim().min(1).max(30),
  condition: z.nativeEnum(ListingCondition),
  pricePer24Hours: z.coerce.number().positive().max(100000),
  securityDeposit: z.coerce.number().min(0).max(1000000).optional(),
  location: z.string().trim().min(2).max(120),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
});

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Please sign in to list an item." },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = createListingSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid listing data." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const data = parsed.data;
  const listing = await prisma.listing.create({
    data: {
      ownerId: session.user.id,
      title: data.title,
      description: data.description,
      category: data.category,
      size: data.size,
      condition: data.condition,
      pricePerDay: data.pricePer24Hours.toFixed(2),
      securityDeposit: (data.securityDeposit ?? data.pricePer24Hours).toFixed(2),
      location: data.location,
      imageUrl: data.imageUrl || null,
      status: ListingStatus.ACTIVE,
    },
    select: {
      id: true,
    },
  });

  return NextResponse.json(
    {
      success: true,
      id: listing.id,
      message: "Item listed successfully.",
    },
    { status: 201, headers: { "Cache-Control": "no-store" } }
  );
}
