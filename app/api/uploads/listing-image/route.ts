import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const BUCKET_NAME = "listing-images";

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Upload service is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Image is too large. Maximum is 5MB." }, { status: 400 });
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const objectPath = `${session.user.id}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const arrayBuffer = await file.arrayBuffer();
  const uploadResult = await supabase.storage
    .from(BUCKET_NAME)
    .upload(objectPath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadResult.error) {
    return NextResponse.json(
      { error: `Upload failed: ${uploadResult.error.message}` },
      { status: 500 }
    );
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(objectPath);

  return NextResponse.json({
    success: true,
    imageUrl: data.publicUrl,
    path: objectPath,
  });
}
