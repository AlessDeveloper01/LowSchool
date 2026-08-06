import type {
  AppFontFamily,
  CurrencyCode,
  Customization,
} from "@/features/customization/types/customization.types";

export const DEFAULT_CUSTOMIZATION: Customization = {
  appName: "Nexora",
  appSubtitle: "Product workspace",
  primaryColor: "#5B5BD6",
  secondaryColor: "#0786A6",
  tertiaryColor: "#B73D9B",
  textColor: "#182033",
  currency: "MXN",
  fontFamily: "OUTFIT",
  logoLightUrl: null,
  logoDarkUrl: null,
  updatedAt: new Date(0).toISOString(),
};

export const CURRENCY_OPTIONS: ReadonlyArray<{
  value: CurrencyCode;
  label: string;
}> = [
  { value: "MXN", label: "Peso mexicano (MXN)" },
  { value: "USD", label: "Dólar estadounidense (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "COP", label: "Peso colombiano (COP)" },
  { value: "ARS", label: "Peso argentino (ARS)" },
  { value: "BRL", label: "Real brasileño (BRL)" },
];

export const FONT_OPTIONS: ReadonlyArray<{
  value: AppFontFamily;
  label: string;
}> = [
  { value: "OUTFIT", label: "Outfit" },
  { value: "INTER", label: "Inter" },
  { value: "ROBOTO", label: "Roboto" },
  { value: "POPPINS", label: "Poppins" },
  { value: "MONTSERRAT", label: "Montserrat" },
  { value: "NUNITO_SANS", label: "Nunito Sans" },
  { value: "LATO", label: "Lato" },
  { value: "DM_SANS", label: "DM Sans" },
  { value: "RUBIK", label: "Rubik" },
  { value: "PLUS_JAKARTA_SANS", label: "Plus Jakarta Sans" },
  { value: "MERRIWEATHER", label: "Merriweather" },
  { value: "PLAYFAIR_DISPLAY", label: "Playfair Display" },
];

export interface ColorPreset {
  id: string;
  name: string;
  description: string;
  category: "Minimalistas" | "Modernos" | "Pasteles" | "Vintage";
  colors: readonly [string, string, string];
}

export const COLOR_PRESETS: readonly ColorPreset[] = [
  {
    id: "minimal-graphite",
    name: "Grafito",
    description: "Sobrio y limpio",
    category: "Minimalistas",
    colors: ["#18181B", "#71717A", "#D4D4D8"],
  },
  {
    id: "minimal-stone",
    name: "Piedra",
    description: "Neutros cálidos",
    category: "Minimalistas",
    colors: ["#292524", "#78716C", "#D6D3D1"],
  },
  {
    id: "minimal-ink",
    name: "Tinta",
    description: "Azules discretos",
    category: "Minimalistas",
    colors: ["#172554", "#475569", "#CBD5E1"],
  },
  {
    id: "modern-electric",
    name: "Eléctrico",
    description: "Vibrante y tecnológico",
    category: "Modernos",
    colors: ["#4F46E5", "#0891B2", "#DB2777"],
  },
  {
    id: "modern-aurora",
    name: "Aurora",
    description: "Fresco y enérgico",
    category: "Modernos",
    colors: ["#7C3AED", "#0D9488", "#F59E0B"],
  },
  {
    id: "modern-coral",
    name: "Coral digital",
    description: "Cálido y contemporáneo",
    category: "Modernos",
    colors: ["#E11D48", "#2563EB", "#F97316"],
  },
  {
    id: "pastel-cotton",
    name: "Algodón",
    description: "Suave y amigable",
    category: "Pasteles",
    colors: ["#A78BFA", "#67E8F9", "#FDA4AF"],
  },
  {
    id: "pastel-garden",
    name: "Jardín",
    description: "Natural y relajado",
    category: "Pasteles",
    colors: ["#86EFAC", "#93C5FD", "#FDE68A"],
  },
  {
    id: "pastel-lavender",
    name: "Lavanda",
    description: "Delicado y elegante",
    category: "Pasteles",
    colors: ["#C4B5FD", "#F9A8D4", "#A5F3FC"],
  },
  {
    id: "vintage-cafe",
    name: "Café clásico",
    description: "Tonos de barra y madera",
    category: "Vintage",
    colors: ["#78350F", "#B45309", "#D97706"],
  },
  {
    id: "vintage-olive",
    name: "Olivo",
    description: "Orgánico y nostálgico",
    category: "Vintage",
    colors: ["#4D5D3A", "#A16207", "#A8553A"],
  },
  {
    id: "vintage-diner",
    name: "Diner",
    description: "Retro con personalidad",
    category: "Vintage",
    colors: ["#9F1239", "#0F766E", "#CA8A04"],
  },
];
