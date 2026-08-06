import type { Metadata } from "next";

import { ComponentShowcase } from "@/components/shared/showcase/component-showcase";

export const metadata: Metadata = {
  title: "Componentes",
  description: "Catálogo interactivo de la biblioteca de componentes.",
};

export default function ComponentsPage() {
  return <ComponentShowcase />;
}
