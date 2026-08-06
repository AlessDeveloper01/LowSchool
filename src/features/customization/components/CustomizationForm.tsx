"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  type ChangeEvent,
  type FormEvent,
  type RefObject,
} from "react";
import {
  LuCoins,
  LuImage,
  LuPalette,
  LuRotateCcw,
  LuSave,
  LuSparkles,
  LuTrash2,
  LuType,
  LuUpload,
} from "react-icons/lu";

import { NativeSelect } from "@/components/forms/select";
import { Input } from "@/components/forms/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormFeedback } from "@/components/ui/form";
import { updateCustomizationAction } from "@/features/customization/actions/customization-actions";
import {
  COLOR_PRESETS,
  CURRENCY_OPTIONS,
  DEFAULT_CUSTOMIZATION,
  FONT_OPTIONS,
} from "@/features/customization/config/customizationConfig";
import { formatCurrency } from "@/features/customization/lib/currency";
import {
  customizationInputSchema,
  MAX_LOGO_BYTES,
} from "@/features/customization/schemas/customizationSchema";
import { useCustomizationStore } from "@/features/customization/store/customizationStore";
import type {
  AppFontFamily,
  CurrencyCode,
  Customization,
  CustomizationInput,
} from "@/features/customization/types/customization.types";

interface CustomizationFormProps {
  initialCustomization: Customization;
}

const defaultInput: CustomizationInput = {
  appName: DEFAULT_CUSTOMIZATION.appName,
  appSubtitle: DEFAULT_CUSTOMIZATION.appSubtitle,
  primaryColor: DEFAULT_CUSTOMIZATION.primaryColor,
  secondaryColor: DEFAULT_CUSTOMIZATION.secondaryColor,
  tertiaryColor: DEFAULT_CUSTOMIZATION.tertiaryColor,
  textColor: DEFAULT_CUSTOMIZATION.textColor,
  currency: DEFAULT_CUSTOMIZATION.currency,
  fontFamily: DEFAULT_CUSTOMIZATION.fontFamily,
  logoLight: { action: "keep" },
  logoDark: { action: "keep" },
};

const PRESET_CATEGORIES = [
  "Minimalistas",
  "Modernos",
  "Pasteles",
  "Vintage",
] as const;

const ALLOWED_LOGO_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject(new Error("No fue posible leer la imagen."));
    reader.onerror = () => reject(new Error("No fue posible leer la imagen."));
    reader.readAsDataURL(file);
  });
}

export function CustomizationForm({
  initialCustomization,
}: CustomizationFormProps) {
  const logoLightInputRef = useRef<HTMLInputElement>(null);
  const logoDarkInputRef = useRef<HTMLInputElement>(null);
  const settings = useCustomizationStore((state) => state.settings);
  const draft = useCustomizationStore((state) => state.draft);
  const dirty = useCustomizationStore((state) => state.draftDirty);
  const saving = useCustomizationStore((state) => state.saving);
  const result = useCustomizationStore((state) => state.result);
  const initialize = useCustomizationStore((state) => state.initialize);
  const updateDraft = useCustomizationStore((state) => state.updateDraft);
  const resetDraft = useCustomizationStore((state) => state.resetDraft);
  const setSaving = useCustomizationStore((state) => state.setSaving);
  const setResult = useCustomizationStore((state) => state.setResult);
  const commit = useCustomizationStore((state) => state.commit);

  useEffect(() => {
    initialize(initialCustomization);
    return () => useCustomizationStore.getState().resetDraft();
  }, [initialCustomization, initialize]);

  async function handleLogoChange(
    event: ChangeEvent<HTMLInputElement>,
    variant: "light" | "dark",
  ): Promise<void> {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_LOGO_TYPES.has(file.type)) {
      setResult({
        success: false,
        message: "El logo debe estar en formato PNG, JPG o WebP.",
        fieldErrors:
          variant === "light"
            ? { logoLight: ["Formato de imagen no permitido."] }
            : { logoDark: ["Formato de imagen no permitido."] },
      });
      return;
    }

    if (file.size > MAX_LOGO_BYTES) {
      setResult({
        success: false,
        message: "El logo no puede superar 2 MB.",
        fieldErrors:
          variant === "light"
            ? { logoLight: ["La imagen supera el límite de 2 MB."] }
            : { logoDark: ["La imagen supera el límite de 2 MB."] },
      });
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      updateDraft(
        variant === "light"
          ? { logoLight: { action: "upload", dataUrl } }
          : { logoDark: { action: "upload", dataUrl } },
      );
    } catch {
      setResult({
        success: false,
        message: "No fue posible leer la imagen seleccionada.",
      });
    }
  }

  const logoLightPreview =
    draft.logoLight.action === "upload"
      ? draft.logoLight.dataUrl
      : draft.logoLight.action === "remove"
        ? null
        : settings.logoLightUrl;
  const logoDarkPreview =
    draft.logoDark.action === "upload"
      ? draft.logoDark.dataUrl
      : draft.logoDark.action === "remove"
        ? null
        : settings.logoDarkUrl;

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const parsed = customizationInputSchema.safeParse(draft);

    if (!parsed.success) {
      setResult({
        success: false,
        message: "Revisa los campos marcados.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    setSaving(true);
    try {
      const actionResult = await updateCustomizationAction(parsed.data);
      setResult(actionResult);
      if (actionResult.success && actionResult.data) commit(actionResult.data);
    } catch {
      setResult({
        success: false,
        message: "No fue posible guardar. Comprueba la conexión con el servidor.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {result && (
        <FormFeedback
          tone={result.success ? "success" : "error"}
          variant="soft"
        >
          {result.message}
        </FormFeedback>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <LuPalette className="text-primary" />
                  Colores del sistema
                </CardTitle>
                <CardDescription>
                  Los estados hover y el contraste del texto se calculan automáticamente.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <LuSparkles className="text-primary" aria-hidden="true" />
                  <p className="text-xs font-extrabold text-foreground">
                    Packs recomendados
                  </p>
                </div>
                <div className="space-y-5">
                  {PRESET_CATEGORIES.map((category) => (
                    <div key={category}>
                      <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted">
                        {category}
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {COLOR_PRESETS.filter(
                          (preset) => preset.category === category,
                        ).map((preset) => {
                          const selected =
                            preset.colors[0] === draft.primaryColor &&
                            preset.colors[1] === draft.secondaryColor &&
                            preset.colors[2] === draft.tertiaryColor;

                          return (
                            <button
                              key={preset.id}
                              type="button"
                              aria-pressed={selected}
                              className={`rounded-xl border p-3 text-left transition-colors ${
                                selected
                                  ? "border-primary bg-primary/5 ring-2 ring-primary/10"
                                  : "border-border bg-background hover:border-primary/40"
                              }`}
                              onClick={() =>
                                updateDraft({
                                  primaryColor: preset.colors[0],
                                  secondaryColor: preset.colors[1],
                                  tertiaryColor: preset.colors[2],
                                })
                              }
                            >
                              <span className="flex gap-1.5">
                                {preset.colors.map((color) => (
                                  <span
                                    key={color}
                                    className="h-7 flex-1 rounded-md border border-black/10"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </span>
                              <span className="mt-2 block text-xs font-extrabold text-foreground">
                                {preset.name}
                              </span>
                              <span className="mt-0.5 block text-[11px] text-muted">
                                {preset.description}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-5">
                <p className="mb-4 text-xs font-extrabold text-foreground">
                  Ajuste manual
                </p>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <ColorField
                    id="primaryColor"
                    label="Color primario"
                    value={draft.primaryColor}
                    error={result?.fieldErrors?.primaryColor?.[0]}
                    onChange={(primaryColor) => updateDraft({ primaryColor })}
                  />
                  <ColorField
                    id="secondaryColor"
                    label="Color secundario"
                    value={draft.secondaryColor}
                    error={result?.fieldErrors?.secondaryColor?.[0]}
                    onChange={(secondaryColor) => updateDraft({ secondaryColor })}
                  />
                  <ColorField
                    id="tertiaryColor"
                    label="Color terciario"
                    value={draft.tertiaryColor}
                    error={result?.fieldErrors?.tertiaryColor?.[0]}
                    onChange={(tertiaryColor) => updateDraft({ tertiaryColor })}
                  />
                  <ColorField
                    id="textColor"
                    label="Color del texto"
                    value={draft.textColor}
                    error={result?.fieldErrors?.textColor?.[0]}
                    onChange={(textColor) => updateDraft({ textColor })}
                  />
                </div>
                <p className="mt-3 text-xs leading-5 text-muted">
                  En modo oscuro se genera automáticamente una variante del mismo tono con contraste legible.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <LuImage className="text-primary" />
                  Identidad del negocio
                </CardTitle>
                <CardDescription>
                  Personaliza el nombre, subtítulo y logos que se muestran en el sistema.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Nombre del producto"
                  value={draft.appName}
                  maxLength={60}
                  error={result?.fieldErrors?.appName?.[0]}
                  onChange={(event) =>
                    updateDraft({ appName: event.target.value })
                  }
                />
                <Input
                  label="Subtítulo"
                  value={draft.appSubtitle}
                  maxLength={100}
                  error={result?.fieldErrors?.appSubtitle?.[0]}
                  onChange={(event) =>
                    updateDraft({ appSubtitle: event.target.value })
                  }
                />
              </div>

              <input
                ref={logoLightInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(event) => void handleLogoChange(event, "light")}
              />
              <input
                ref={logoDarkInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(event) => void handleLogoChange(event, "dark")}
              />

              <div className="grid gap-4 lg:grid-cols-2">
                <LogoVariantEditor
                  title="Logo para modo claro"
                  description="Utiliza una versión oscura o con suficiente contraste sobre fondos claros."
                  preview={logoLightPreview}
                  previewSurface="light"
                  inputRef={logoLightInputRef}
                  error={result?.fieldErrors?.logoLight?.[0]}
                  saving={saving}
                  onRemove={() =>
                    updateDraft({ logoLight: { action: "remove" } })
                  }
                />
                <LogoVariantEditor
                  title="Logo para modo oscuro"
                  description="Utiliza una versión clara para conservar legibilidad sobre fondos oscuros."
                  preview={logoDarkPreview}
                  previewSurface="dark"
                  inputRef={logoDarkInputRef}
                  error={result?.fieldErrors?.logoDark?.[0]}
                  saving={saving}
                  onRemove={() =>
                    updateDraft({ logoDark: { action: "remove" } })
                  }
                />
              </div>
              <p className="text-xs leading-5 text-muted">
                Formatos PNG, JPG o WebP, máximo 2 MB por archivo. Si sólo configuras uno, se usará como respaldo en ambos modos.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <LuCoins className="text-secondary" />
                    Moneda
                  </CardTitle>
                  <CardDescription>
                    Define el formato monetario predeterminado del sistema.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <NativeSelect
                  label="Tipo de moneda"
                  value={draft.currency}
                  options={CURRENCY_OPTIONS.map((option) => option)}
                  onChange={(event) =>
                    updateDraft({ currency: event.target.value as CurrencyCode })
                  }
                  error={result?.fieldErrors?.currency?.[0]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <LuType className="text-tertiary" />
                    Tipografía
                  </CardTitle>
                  <CardDescription>
                    La fuente seleccionada se aplica a toda la aplicación.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <NativeSelect
                  label="Familia tipográfica"
                  value={draft.fontFamily}
                  options={FONT_OPTIONS.map((option) => option)}
                  onChange={(event) =>
                    updateDraft({
                      fontFamily: event.target.value as AppFontFamily,
                    })
                  }
                  error={result?.fieldErrors?.fontFamily?.[0]}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <Card variant="elevated" className="h-fit xl:sticky xl:top-24">
          <CardHeader>
            <div>
              <CardTitle>Vista previa</CardTitle>
              <CardDescription>
                Los cambios se muestran antes de guardarlos.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="mb-4 text-center text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted">
                Vista previa del ticket
              </p>
              {(logoLightPreview ?? logoDarkPreview) && (
                <Image
                  src={logoLightPreview ?? logoDarkPreview ?? ""}
                  alt="Logo en ticket"
                  width={240}
                  height={96}
                  unoptimized={(logoLightPreview ?? logoDarkPreview)?.startsWith(
                    "data:",
                  )}
                  className="mx-auto mb-4 max-h-20 w-auto max-w-full object-contain"
                />
              )}
              <p className="text-center text-lg font-extrabold">
                {draft.appName}
              </p>
              <p className="mt-1 text-center text-sm text-muted">
                {draft.appSubtitle}
              </p>
              <p className="mt-4 text-center text-2xl font-black text-foreground">
                {formatCurrency(1234.5, draft.currency as CurrencyCode)}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button size="sm" variant="primary">Primario</Button>
              <Button size="sm" variant="secondary">Secundario</Button>
              <Button size="sm" variant="tertiary">Terciario</Button>
            </div>
            <div className="flex gap-2">
              {[draft.primaryColor, draft.secondaryColor, draft.tertiaryColor].map(
                (color) => (
                  <span
                    key={color}
                    className="h-10 flex-1 rounded-lg border border-border"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ),
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            leftIcon={<LuRotateCcw />}
            disabled={!dirty || saving}
            onClick={resetDraft}
          >
            Descartar cambios
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={saving}
            onClick={() => updateDraft(defaultInput)}
          >
            Usar valores iniciales
          </Button>
        </div>
        <Button
          type="submit"
          variant="primary"
          leftIcon={<LuSave />}
          loading={saving}
          loadingText="Guardando..."
          disabled={!dirty}
        >
          Guardar para todos
        </Button>
      </div>
    </form>
  );
}

interface LogoVariantEditorProps {
  title: string;
  description: string;
  preview: string | null;
  previewSurface: "light" | "dark";
  inputRef: RefObject<HTMLInputElement | null>;
  error?: string;
  saving: boolean;
  onRemove: () => void;
}

function LogoVariantEditor({
  title,
  description,
  preview,
  previewSurface,
  inputRef,
  error,
  saving,
  onRemove,
}: LogoVariantEditorProps) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-background p-4">
      <div
        className={`grid h-32 place-items-center overflow-hidden rounded-xl border p-3 ${
          previewSurface === "dark"
            ? "border-slate-700 bg-slate-950"
            : "border-slate-200 bg-white"
        }`}
      >
        {preview ? (
          <Image
            src={preview}
            alt={`Vista previa: ${title.toLowerCase()}`}
            width={260}
            height={112}
            unoptimized={preview.startsWith("data:")}
            className="max-h-full w-auto max-w-full object-contain"
          />
        ) : (
          <div
            className={
              previewSurface === "dark"
                ? "text-center text-slate-400"
                : "text-center text-slate-500"
            }
          >
            <LuImage className="mx-auto size-7" aria-hidden="true" />
            <p className="mt-2 text-xs font-bold">Sin logo</p>
          </div>
        )}
      </div>
      <p className="mt-3 text-sm font-extrabold text-foreground">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          leftIcon={<LuUpload />}
          disabled={saving}
          onClick={() => inputRef.current?.click()}
        >
          {preview ? "Cambiar logo" : "Subir logo"}
        </Button>
        {preview && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            leftIcon={<LuTrash2 />}
            disabled={saving}
            onClick={onRemove}
          >
            Quitar
          </Button>
        )}
      </div>
    </div>
  );
}

interface ColorFieldProps {
  id: keyof Pick<
    CustomizationInput,
    "primaryColor" | "secondaryColor" | "tertiaryColor" | "textColor"
  >;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

function ColorField({
  id,
  label,
  value,
  error,
  onChange,
}: ColorFieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-xs font-extrabold text-foreground">
          {label}
        </label>
        <input
          type="color"
          aria-label={`Selector para ${label.toLowerCase()}`}
          value={/^#[0-9A-Fa-f]{6}$/.test(value) ? value : "#000000"}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          className="size-9 cursor-pointer rounded-lg border border-border bg-surface p-1"
        />
      </div>
      <Input
        id={id}
        value={value}
        maxLength={7}
        spellCheck={false}
        autoComplete="off"
        error={error}
        onChange={(event) => onChange(event.target.value.toUpperCase())}
      />
    </div>
  );
}
