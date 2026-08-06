import { CustomizationService } from "@/features/customization/services/CustomizationService";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  try {
    const customization = await CustomizationService.getCustomization();
    return Response.json(customization, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return Response.json(
      { message: "No fue posible cargar la personalización global." },
      {
        status: 503,
        headers: { "Cache-Control": "no-store, max-age=0" },
      },
    );
  }
}
