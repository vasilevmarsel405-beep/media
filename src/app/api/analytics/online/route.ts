import { NextResponse } from "next/server";
import { getOnlineNowCount } from "@/lib/redis-analytics";

export const runtime = "nodejs";

export async function GET() {
  const online = await getOnlineNowCount();
  return NextResponse.json(
    { online },
    {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
      },
    }
  );
}
