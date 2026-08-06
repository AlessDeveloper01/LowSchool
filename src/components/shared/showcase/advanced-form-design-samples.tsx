"use client";

import { useState } from "react";

import {
  AutocompleteField,
  ColorPicker,
  CreditCardInput,
  CurrencyField,
  DateRangeInput,
  Fieldset,
  FileUpload,
  FloatingLabelInput,
  FormField,
  FormSection,
  ImageUpload,
  Input,
  InputAddon,
  InputGroup,
  NativeSelect,
  OTPInput,
  PasswordStrengthInput,
  PhoneField,
  PostalCodeInput,
  PrefixField,
  QuantityInput,
  RatingInput,
  SearchField,
  Slider,
  Switch,
  TagInput,
  Textarea,
} from "@/components/forms";
import { DemoBlock } from "@/components/shared/showcase/showcase-section";

const countryOptions = [
  { label: "México", value: "mx" },
  { label: "España", value: "es" },
] as const;

const searchSuggestions = [
  { id: "overview", label: "Resumen", description: "Vista ejecutiva" },
  { id: "billing", label: "Facturación", description: "Pagos y planes" },
] as const;

export function AdvancedFormDesignSamples() {
  const [otp, setOtp] = useState("204");
  const [tags, setTags] = useState(["Diseño", "Sistema"]);
  const [rating, setRating] = useState(4);
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);

  return (
    <>
      <DemoBlock title="Texto, selección y fechas · presets combinables">
        <div className="space-y-3">
          <Textarea design="soft" label="Textarea soft" defaultValue="Los presets no reemplazan las variantes." />
          <NativeSelect design="elevated" label="Select elevated" options={[...countryOptions]} />
          <DateRangeInput design="sharp" />
          <FloatingLabelInput design="pill" label="Floating pill" defaultValue="Nexora" />
        </div>
      </DemoBlock>

      <DemoBlock title="Controles, carga y valoración · presets compartidos">
        <div className="space-y-4">
          <Switch design="gradient" defaultChecked label="Switch gradient" />
          <Slider design="brutalist" label="Slider brutalist" defaultValue={68} />
          <ColorPicker design="glass" />
          <OTPInput design="pill" value={otp} onChange={setOtp} />
          <RatingInput design="outline" value={rating} onChange={setRating} />
          <FileUpload design="minimal" files={files} onFilesChange={setFiles} />
          <ImageUpload design="soft" files={images} onFilesChange={setImages} label="ImageUpload soft" />
        </div>
      </DemoBlock>

      <DemoBlock title="Layouts de formulario · diseño por raíz">
        <FormSection design="gradient" title="Cuenta" description="El mismo contrato visual funciona en contenedores." columns={1} className="p-4">
          <FormField design="minimal" label="Workspace" className="p-2">
            <InputGroup design="sharp">
              <InputAddon design="soft">@</InputAddon>
              <Input design="minimal" defaultValue="nexora" />
            </InputGroup>
          </FormField>
          <Fieldset design="outline" legend="Preferencias" className="p-4">
            <Switch design="pill" defaultChecked label="Notificaciones" />
          </Fieldset>
        </FormSection>
      </DemoBlock>

      <DemoBlock title="Tags, cantidad y seguridad · diseños independientes">
        <div className="space-y-4">
          <TagInput design="pill" value={tags} onValueChange={setTags} />
          <QuantityInput design="elevated" defaultValue={3} />
          <PasswordStrengthInput design="gradient" defaultValue="Nexora#2026" />
        </div>
      </DemoBlock>

      <DemoBlock title="Búsqueda y campos compuestos · diez presets">
        <div className="space-y-4">
          <SearchField design="glass" suggestions={searchSuggestions} placeholder="Search glass" />
          <AutocompleteField design="soft" suggestions={searchSuggestions} placeholder="Autocomplete soft" />
          <PhoneField design="pill" defaultCountryCode="MX" defaultValue="55 1234 5678" />
          <CurrencyField design="outline" currency="MXN" defaultValue={24900} />
        </div>
      </DemoBlock>

      <DemoBlock title="Prefijos y máscaras · mismo contrato visual">
        <div className="space-y-4">
          <PrefixField design="brutalist" prefix="@" suffix=".app" defaultValue="nexora" />
          <CreditCardInput design="sharp" defaultValue="4242424242424242" />
          <PostalCodeInput design="minimal" defaultValue="06100" />
        </div>
      </DemoBlock>
    </>
  );
}
