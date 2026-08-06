import { z } from "zod";

export const currencyCodeSchema = z.enum([
  "MXN",
  "USD",
  "EUR",
  "COP",
  "ARS",
  "BRL",
]);

export const appFontFamilySchema = z.enum([
  "OUTFIT",
  "INTER",
  "ROBOTO",
  "POPPINS",
  "MONTSERRAT",
  "NUNITO_SANS",
  "LATO",
  "DM_SANS",
  "RUBIK",
  "PLUS_JAKARTA_SANS",
  "MERRIWEATHER",
  "PLAYFAIR_DISPLAY",
]);

export const MAX_LOGO_BYTES = 2 * 1024 * 1024;

const logoDataUrlSchema = z
  .string()
  .regex(
    /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/,
    "El logo debe ser una imagen PNG, JPG o WebP válida.",
  )
  .superRefine((value, context) => {
    const base64 = value.slice(value.indexOf(",") + 1);
    const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
    const decodedBytes = Math.floor((base64.length * 3) / 4) - padding;

    if (decodedBytes > MAX_LOGO_BYTES) {
      context.addIssue({
        code: "custom",
        message: "El logo no puede superar 2 MB.",
      });
    }
  });

export const logoChangeSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("keep") }),
  z.object({ action: z.literal("remove") }),
  z.object({
    action: z.literal("upload"),
    dataUrl: logoDataUrlSchema,
  }),
]);

const hexColorSchema = z
  .string()
  .trim()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Usa un color hexadecimal de 6 caracteres.")
  .transform((value) => value.toUpperCase());

export const customizationInputSchema = z.object({
  appName: z
    .string()
    .trim()
    .min(2, "El nombre debe contener al menos 2 caracteres.")
    .max(60, "El nombre no puede superar 60 caracteres."),
  appSubtitle: z
    .string()
    .trim()
    .min(2, "El subtítulo debe contener al menos 2 caracteres.")
    .max(100, "El subtítulo no puede superar 100 caracteres."),
  primaryColor: hexColorSchema,
  secondaryColor: hexColorSchema,
  tertiaryColor: hexColorSchema,
  textColor: hexColorSchema,
  currency: currencyCodeSchema,
  fontFamily: appFontFamilySchema,
  logoLight: logoChangeSchema,
  logoDark: logoChangeSchema,
});

export const customizationSchema = customizationInputSchema
  .omit({ logoLight: true, logoDark: true })
  .extend({
    logoLightUrl: z.string().url().nullable(),
    logoDarkUrl: z.string().url().nullable(),
    updatedAt: z.string().datetime(),
  });
