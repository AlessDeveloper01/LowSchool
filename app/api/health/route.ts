export const dynamic = "force-dynamic";

/** Lightweight public probe. It never reads Prisma, cookies or user data. */
export async function GET(): Promise<Response> {
  return Response.json(
    {
      status: "ok",
      service: "lowpos",
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
