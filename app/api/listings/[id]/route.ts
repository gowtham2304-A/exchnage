import { ListingCondition, ListingStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateListingSchema = z.object({
  title: z.string().trim().min(3).max(120).optional(),
  description: z.string().trim().min(20).max(3000).optional(),
  category: z.string().trim().min(2).max(60).optional(),
  size: z.string().trim().min(1).max(30).optional(),
  condition: z.nativeEnum(ListingCondition).optional(),
  pricePer24Hours: z.coerce.number().positive().max(100000).optional(),
  securityDeposit: z.coerce.number().min(0).max(1000000).optional(),
  location: z.string().trim().min(2).max(120).optional(),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
  status: z.nativeEnum(ListingStatus).optional(),
});

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const existingListing = await prisma.listing.findUnique({
    where: { id },
    select: { ownerId: true },
  });

  if (!existingListing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  if (existingListing.ownerId !== session.user.id) {
    return NextResponse.json({ error: "You can only edit your own listings." }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = updateListingSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data provided." }, { status: 400 });
  }

  const data = parsed.data;

  // Build update data object
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.size !== undefined) updateData.size = data.size;
  if (data.condition !== undefined) updateData.condition = data.condition;
  if (data.pricePer24Hours !== undefined) updateData.pricePerDay = data.pricePer24Hours.toFixed(2);
  if (data.securityDeposit !== undefined) updateData.securityDeposit = data.securityDeposit.toFixed(2);
  if (data.location !== undefined) updateData.location = data.location;
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl || null;
  if (data.status !== undefined) updateData.status = data.status;
  updateData.updatedAt = new Date();

  await prisma.listing.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ success: true, id, message: "Listing updated successfully." });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const existingListing = await prisma.listing.findUnique({
    where: { id },
    select: { ownerId: true },
  });

  if (!existingListing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  if (existingListing.ownerId !== session.user.id) {
    return NextResponse.json({ error: "You can only delete your own listings." }, { status: 403 });
  }

  // Instead of deleting, we change status to ARCHIVED so past rentals/messages aren't orphaned
  await prisma.listing.update({
    where: { id },
    data: { status: ListingStatus.ARCHIVED },
  });

  return NextResponse.json({ success: true, message: "Listing archived successfully." });
}
