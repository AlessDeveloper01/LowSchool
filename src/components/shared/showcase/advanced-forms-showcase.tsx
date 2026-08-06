"use client";

import { useState } from "react";
import { LuAtSign, LuPlus } from "react-icons/lu";

import {
  AutocompleteField,
  CreditCardInput,
  CurrencyField,
  PasswordStrengthInput,
  PhoneField,
  PostalCodeInput,
  PrefixField,
  QuantityInput,
  SearchField,
  StepperInput,
  TagInput,
  TagInputAddButton,
  TokenInput,
} from "@/components/forms";
import { DemoBlock } from "@/components/shared/showcase/showcase-section";

const suggestions = [
  {
    id: "dashboard",
    label: "Dashboard ejecutivo",
    description: "Métricas y actividad",
    keywords: ["inicio", "resumen"],
  },
  {
    id: "customers",
    label: "Clientes",
    description: "Directorio y segmentos",
    keywords: ["usuarios", "contactos"],
  },
  {
    id: "settings",
    label: "Configuración",
    description: "Preferencias del proyecto",
    keywords: ["ajustes"],
  },
] as const;

export function AdvancedFormsShowcase() {
  const [tags, setTags] = useState(["React", "TypeScript", "Tailwind"]);

  return (
    <>
      <DemoBlock title="TagInput, TokenInput y acciones de etiquetas">
        <div className="space-y-4">
          <TagInput
            label="Tecnologías"
            value={tags}
            onValueChange={setTags}
            maxTags={6}
            variant="pill"
            description="Enter, coma o punto y coma para agregar."
          />
          <TokenInput
            label="Permisos"
            defaultValue={["read:users", "write:reports"]}
          />
          <TagInputAddButton onAdd={() => setTags((current) => [...current, `Tag ${current.length + 1}`])}>
            Agregar automáticamente
          </TagInputAddButton>
        </div>
      </DemoBlock>

      <DemoBlock title="QuantityInput y StepperInput">
        <div className="flex flex-wrap items-end gap-4">
          <QuantityInput label="Unidades" defaultValue={3} min={0} max={12} />
          <QuantityInput label="Pill" variant="pill" defaultValue={8} />
          <QuantityInput label="Compact" variant="compact" defaultValue={2} inputSize="sm" />
          <StepperInput label="Split" defaultValue={24.5} step={0.5} />
          <QuantityInput
            label="Customized"
            variant="customized"
            defaultValue={5}
            className="bg-violet-950 text-violet-50"
            decrementClassName="rounded-l-full bg-violet-200 text-violet-950"
            incrementClassName="rounded-r-full bg-violet-400 text-violet-950"
          />
        </div>
      </DemoBlock>

      <DemoBlock title="PasswordStrength y campos de acceso">
        <div className="grid gap-4 sm:grid-cols-2">
          <PasswordStrengthInput
            label="Contraseña"
            defaultValue="Nexora#2026"
            showRules
          />
          <PasswordStrengthInput
            label="Indicador compacto"
            defaultValue="Dashboard42"
            strengthVariant="meter"
          />
          <PrefixField
            label="Usuario"
            prefix={<LuAtSign />}
            suffix=".nexora"
            defaultValue="alex"
          />
          <CreditCardInput label="Tarjeta" defaultValue="4242424242424242" />
        </div>
      </DemoBlock>

      <DemoBlock title="SearchField y AutocompleteField">
        <div className="grid gap-4 sm:grid-cols-2">
          <SearchField
            label="Buscar módulo"
            suggestions={suggestions}
            placeholder="Escribe Dashboard..."
          />
          <AutocompleteField
            label="Ir rápidamente"
            suggestions={suggestions}
            defaultValue="Clientes"
            inputVariant="soft"
          />
        </div>
      </DemoBlock>

      <DemoBlock title="PhoneField, CurrencyField y máscaras">
        <div className="grid gap-4 sm:grid-cols-2">
          <PhoneField
            label="Teléfono"
            defaultCountryCode="MX"
            defaultValue="55 1234 5678"
            description="País y número en un solo contrato."
          />
          <CurrencyField
            label="Presupuesto"
            currency="MXN"
            defaultValue={24500}
            variant="elevated"
          />
          <PostalCodeInput label="Código postal" defaultValue="06100" />
          <CreditCardInput
            label="Tarjeta personalizada"
            variant="customized"
            defaultValue="5555444433332222"
            controlClassName="rounded-full border-2 border-cyan-400 bg-cyan-950 px-4 focus-within:ring-4 focus-within:ring-cyan-400/20"
            className="text-cyan-50"
          />
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted">
          <LuPlus />
          Todos funcionan controlados o no controlados y sin librerías de
          máscara.
        </div>
      </DemoBlock>
    </>
  );
}
