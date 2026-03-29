import { NextResponse } from "next/server";
import { getAnalyticsSnapshot } from "@/lib/redis-analytics";
import { fetchMetrikaTraffic7d } from "@/lib/yandex-metrika-api";

export const runtime = "nodejs";

export async function GET() {
  const [snap, metrika] = await Promise.all([getAnalyticsSnapshot(), fetchMetrikaTraffic7d()]);
  if (!snap) {
    return NextResponse.json({
      onlineNow: 0,
      visitorsLifetime: 0,
      visitorsWeek: 0,
      visitorsMonth: 0,
      topPosts: [],
      topPaths: [],
      analyticsConfigured: false,
      metrika,
    });
  }
  return NextResponse.json({ ...snap, analyticsConfigured: true, metrika });
}
