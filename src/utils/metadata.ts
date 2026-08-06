import { Metadata } from "next";

interface MedataOptions {
  title: string;
  description?: string;
}

export function generateMetadata({
  title,
  description,
}: MedataOptions): Metadata {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Nexora";
  const appDescription =
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ?? "Product workspace";

  return {
    title: title === appName ? title : `${title} · ${appName}`,
    description: description || `${appName} - ${appDescription}`,
  };
}
