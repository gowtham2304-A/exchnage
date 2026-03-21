import { ListingCondition, ListingStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createListingSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters.").max(120),
  description: z.string().trim().min(20, "Description must be at least 20 characters.").max(3000),
  category: z.string().trim().min(2, "Category must be at least 2 characters.").max(60),
  size: z.string().trim().min(1, "Size is required.").max(30),
  condition: z.nativeEnum(ListingCondition),
  pricePer24Hours: z.coerce.number().positive("Price for 24 hours must be greater than 0.").max(100000),
  securityDeposit: z.coerce.number().min(0, "Security deposit cannot be negative.").max(1000000).optional(),
  location: z.string().trim().min(2, "Location must be at least 2 characters.").max(120),
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
    const firstIssue = parsed.error.issues[0];
    const field = firstIssue?.path?.[0];
    const fallbackMessages: Record<string, string> = {
      title: "Please enter a valid title.",
      description: "Please enter a longer description.",
      category: "Please enter a valid category.",
      size: "Please enter size.",
      condition: "Please select item condition.",
      pricePer24Hours: "Please enter a valid price for 24 hours.",
      securityDeposit: "Please enter a valid security deposit.",
      location: "Please enter a valid location.",
      imageUrl: "Uploaded image URL is invalid.",
    };

    return NextResponse.json(
      { error: firstIssue?.message || (typeof field === "string" ? fallbackMessages[field] : undefined) || "Invalid listing data." },
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
