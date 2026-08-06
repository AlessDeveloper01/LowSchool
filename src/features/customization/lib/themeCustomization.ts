import type {
  AppFontFamily,
  Customization,
} from "@/features/customization/types/customization.types";

const fontVariables: Record<AppFontFamily, string> = {
  OUTFIT: "var(--font-outfit-sans)",
  INTER: "var(--font-inter-sans)",
  ROBOTO: "var(--font-roboto-sans)",
  POPPINS: "var(--font-poppins-sans)",
  MONTSERRAT: "var(--font-montserrat-sans)",
  NUNITO_SANS: "var(--font-nunito-sans)",
  LATO: "var(--font-lato-sans)",
  DM_SANS: "var(--font-dm-sans)",
  RUBIK: "var(--font-rubik-sans)",
  PLUS_JAKARTA_SANS: "var(--font-plus-jakarta-sans)",
  MERRIWEATHER: "var(--font-merriweather-serif)",
  PLAYFAIR_DISPLAY: "var(--font-playfair-serif)",
};

function parseHexColor(color: string): [number, number, number] {
  return [
    Number.parseInt(color.slice(1, 3), 16),
    Number.parseInt(color.slice(3, 5), 16),
    Number.parseInt(color.slice(5, 7), 16),
  ];
}

function relativeLuminance(color: string): number {
  const [red, green, blue] = parseHexColor(color).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground: string, background: string): number {
  const lighter = Math.max(
    relativeLuminance(foreground),
    relativeLuminance(background),
  );
  const darker = Math.min(
    relativeLuminance(foreground),
    relativeLuminance(background),
  );
  return (lighter + 0.05) / (darker + 0.05);
}

function mixWithWhite(color: string, amount: number): string {
  const [red, green, blue] = parseHexColor(color);
  return `#${toHex(red + (255 - red) * amount)}${toHex(
    green + (255 - green) * amount,
  )}${toHex(blue + (255 - blue) * amount)}`.toUpperCase();
}

export function textColorForDarkMode(color: string): string {
  const darkBackground = "#111827";
  if (contrastRatio(color, darkBackground) >= 4.5) return color;

  for (let amount = 0.1; amount <= 1; amount += 0.1) {
    const candidate = mixWithWhite(color, amount);
    if (contrastRatio(candidate, darkBackground) >= 4.5) return candidate;
  }

  return "#FFFFFF";
}

function toHex(value: number): string {
  return Math.round(Math.max(0, Math.min(255, value)))
    .toString(16)
    .padStart(2, "0");
}

export function darkenColor(color: string, amount = 0.16): string {
  const [red, green, blue] = parseHexColor(color);
  const factor = 1 - amount;
  return `#${toHex(red * factor)}${toHex(green * factor)}${toHex(blue * factor)}`.toUpperCase();
}

export function readableForeground(color: string): "#111827" | "#FFFFFF" {
  const [red, green, blue] = parseHexColor(color).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  return luminance > 0.48 ? "#111827" : "#FFFFFF";
}

export function applyCustomizationToDocument(
  customization: Customization,
): void {
  const root = document.documentElement;
  const colorEntries = [
    ["primary", customization.primaryColor],
    ["secondary", customization.secondaryColor],
    ["tertiary", customization.tertiaryColor],
  ] as const;

  for (const [name, color] of colorEntries) {
    root.style.setProperty(`--theme-${name}`, color);
    root.style.setProperty(`--theme-${name}-hover`, darkenColor(color));
    root.style.setProperty(
      `--theme-${name}-foreground`,
      readableForeground(color),
    );
  }

  root.style.setProperty("--theme-accent", customization.tertiaryColor);
  root.style.setProperty(
    "--theme-accent-foreground",
    readableForeground(customization.tertiaryColor),
  );
  root.style.setProperty("--theme-info", customization.secondaryColor);
  root.style.setProperty(
    "--theme-info-foreground",
    readableForeground(customization.secondaryColor),
  );
  root.style.setProperty("--theme-custom-foreground", customization.textColor);
  root.style.setProperty(
    "--theme-custom-dark-foreground",
    textColorForDarkMode(customization.textColor),
  );
  root.style.setProperty(
    "--theme-font-family",
    fontVariables[customization.fontFamily],
  );

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", customization.primaryColor);
}
