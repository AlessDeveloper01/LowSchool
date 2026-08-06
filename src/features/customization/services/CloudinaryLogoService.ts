import "server-only";

import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";

interface CloudinaryConfiguration {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

interface StoredLogo {
  url: string;
  publicId: string;
}

export class LogoStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LogoStorageError";
  }
}

const uploadResponseSchema = z.object({
  secure_url: z.string().url(),
  public_id: z.string().min(1),
});

function getConfiguration(): CloudinaryConfiguration {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new LogoStorageError(
      "Cloudinary no está configurado. Agrega CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET.",
    );
  }

  return { cloudName, apiKey, apiSecret };
}

function createSignature(
  parameters: Readonly<Record<string, string>>,
  apiSecret: string,
): string {
  const serialized = Object.entries(parameters)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1")
    .update(`${serialized}${apiSecret}`)
    .digest("hex");
}

async function upload(
  dataUrl: string,
  variant: "light" | "dark",
): Promise<StoredLogo> {
  const configuration = getConfiguration();
  const parameters = {
    folder: "lowpos/branding",
    overwrite: "false",
    public_id: `logo-${variant}-${randomUUID()}`,
    timestamp: Math.floor(Date.now() / 1000).toString(),
    unique_filename: "false",
  } as const;
  const body = new URLSearchParams({
    ...parameters,
    api_key: configuration.apiKey,
    file: dataUrl,
    signature: createSignature(parameters, configuration.apiSecret),
  });
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(configuration.cloudName)}/image/upload`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new LogoStorageError(
      "Cloudinary rechazó el logo. Revisa las credenciales y vuelve a intentarlo.",
    );
  }

  const parsed = uploadResponseSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new LogoStorageError(
      "Cloudinary devolvió una respuesta inesperada al subir el logo.",
    );
  }

  return {
    url: parsed.data.secure_url,
    publicId: parsed.data.public_id,
  };
}

async function remove(publicId: string): Promise<void> {
  const configuration = getConfiguration();
  const parameters = {
    invalidate: "true",
    public_id: publicId,
    timestamp: Math.floor(Date.now() / 1000).toString(),
  } as const;
  const body = new URLSearchParams({
    ...parameters,
    api_key: configuration.apiKey,
    signature: createSignature(parameters, configuration.apiSecret),
  });

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(configuration.cloudName)}/image/destroy`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new LogoStorageError(
      "No fue posible eliminar el logo anterior de Cloudinary.",
    );
  }
}

export const CloudinaryLogoService = {
  upload,
  remove,
};
