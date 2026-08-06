import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthService } from "@/features/auth/services/AuthService";
import { CustomizationForm } from "@/features/customization/components/CustomizationForm";
import { CustomizationService } from "@/features/customization/services/CustomizationService";

export const metadata: Metadata = {
  title: "Personalización",
};

export const dynamic = "force-dynamic";

export default async function CustomizationPage() {
  const user = await AuthService.getSessionUser();
  if (!user || user.role !== "SUPER_ADMIN") redirect("/orders");

  const customization = await CustomizationService.getCustomization();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-secondary">
          Configuración global
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground">
          Personalización del sistema
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          Estos valores se guardan en PostgreSQL y se aplican a todos los usuarios y dispositivos.
        </p>
      </div>
      <CustomizationForm initialCustomization={customization} />
    </div>
  );
}
