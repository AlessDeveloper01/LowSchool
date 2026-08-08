export const dynamic = "force-dynamic";

import { getPrisma } from "@/lib/prisma";

export async function GET(): Promise<Response> {
  try {
    await getPrisma().$queryRaw`SELECT 1`;
    return Response.json({ status: "ok", service: "lowschool", database: "ok", timestamp: new Date().toISOString() }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error) {
    console.error("[health] Database connection failed", error);
    return Response.json({ status: "error", service: "lowschool", database: "unavailable", timestamp: new Date().toISOString() }, { status: 503, headers: { "Cache-Control": "no-store, max-age=0" } });
  }
}
