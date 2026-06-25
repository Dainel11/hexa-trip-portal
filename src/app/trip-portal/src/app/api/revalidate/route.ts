import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * Optional "publish now" endpoint. Normally content refreshes on its own timer,
 * but HR can force an instant update by visiting:
 *   /api/revalidate?secret=YOUR_SECRET&path=/rooms
 * (or path=/ to refresh everything's home). Set REVALIDATE_SECRET in Vercel.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const path = searchParams.get("path") ?? "/";
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, message: "Invalid secret" }, { status: 401 });
  }
  revalidatePath(path);
  return NextResponse.json({ ok: true, revalidated: path, now: Date.now() });
}
