"use client";

import { useState } from "react";
import { LuAtSign, LuLockKeyhole, LuUserRound } from "react-icons/lu";

import {
  Autocomplete,
  Checkbox,
  CheckboxGroup,
  Combobox,
  CurrencyInput,
  ColorPicker,
  DateInput,
  DateRangeInput,
  EmailInput,
  FileUpload,
  Fieldset,
  FloatingLabelInput,
  Form,
  FormFeedback,
  FormField,
  FormInput,
  FormLabel,
  FormSection,
  FormSubmit,
  ImageUpload,
  Input,
  InputAddon,
  InputGroup,
  MultiSelect,
  NativeSelect,
  NumberInput,
  OTPInput,
  PasswordInput,
  PhoneInput,
  Radio,
  RadioGroup,
  Rating,
  RatingInput,
  SearchInput,
  SegmentedControl,
  Select,
  Switch,
  Slider,
  Textarea,
  TimeInput,
  Toggle,
  ToggleGroup,
  URLInput,
} from "@/components/forms";
import { DemoBlock, ShowcaseSection } from "@/components/shared/showcase/showcase-section";
import { AdvancedFormsShowcase } from "@/components/shared/showcase/advanced-forms-showcase";
import { AdvancedFormDesignSamples } from "@/components/shared/showcase/advanced-form-design-samples";
import { FormDesignMatrices } from "@/components/shared/showcase/form-design-matrices";

const options = [
  { label: "México", value: "mx" },
  { label: "Colombia", value: "co" },
  { label: "Argentina", value: "ar" },
];

export function FormsShowcase() {
  const [search, setSearch] = useState("");
  const [checkboxes, setCheckboxes] = useState<string[]>(["email"]);
  const [radio, setRadio] = useState("monthly");
  const [switchOn, setSwitchOn] = useState(true);
  const [toggles, setToggles] = useState<string[]>(["grid"]);
  const [segment, setSegment] = useState("monthly");
  const [otp, setOtp] = useState("");
  const [rating, setRating] = useState(4);
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);

  return (
    <ShowcaseSection id="forms" title="Formularios" description="Entradas accesibles, controles nativos, selección, validación y carga local de archivos.">
      <div className="grid gap-4 xl:grid-cols-2">
        <FormDesignMatrices />
        <DemoBlock title="Form, Label, Input, Feedback y Submit">
          <Form variant="plain" spacing="compact" onSubmit={(event) => event.preventDefault()}>
            <div className="space-y-1.5">
              <FormLabel htmlFor="showcase-name" required hint="Nombre visible en tu cuenta.">Nombre</FormLabel>
              <FormInput id="showcase-name" placeholder="Alex Rivera" leadingIcon={<LuUserRound />} />
            </div>
            <FormFeedback tone="success" variant="soft" title="Disponible">El nombre puede utilizarse.</FormFeedback>
            <FormSubmit fullWidth>Guardar información</FormSubmit>
          </Form>
        </DemoBlock>
        <DemoBlock title="Input y variantes">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Outline" placeholder="Escribe aquí" leftIcon={<LuAtSign />} />
            <Input label="Filled" variant="filled" placeholder="Fondo relleno" success="Valor válido" />
            <Input label="Underlined" variant="underlined" placeholder="Línea inferior" />
            <Input label="Soft" variant="soft" placeholder="Acento tenue" />
            <Input label="Minimal" variant="minimal" placeholder="Sin borde inicial" />
            <Input label="Glass" variant="glass" placeholder="Translúcido" />
            <Input label="Elevated" variant="elevated" placeholder="Profundidad suave" />
            <Input label="Contrast" variant="contrast" placeholder="Alto contraste" />
            <Input
              label="Customized"
              variant="customized"
              placeholder="Diseño del cliente"
              controlClassName="rounded-full border-2 border-orange-400 bg-orange-50 px-4 text-orange-700 focus-within:ring-4 focus-within:ring-orange-400/20 dark:bg-orange-950/25"
              className="text-orange-950 dark:text-orange-50"
            />
            <Input label="Error" error="Este campo es obligatorio" defaultValue="Valor inválido" />
          </div>
        </DemoBlock>
        <DemoBlock title="Inputs especializados">
          <div className="grid gap-3 sm:grid-cols-2">
            <PasswordInput label="Contraseña" leftIcon={<LuLockKeyhole />} defaultValue="password" />
            <SearchInput label="Búsqueda" value={search} onChange={(event) => setSearch(event.target.value)} onClear={() => setSearch("")} />
            <NumberInput label="Cantidad" defaultValue={12} />
            <CurrencyInput label="Importe" defaultValue={2499} />
            <EmailInput label="Email" placeholder="hola@empresa.com" />
            <PhoneInput label="Teléfono" placeholder="+52 55 0000 0000" />
            <URLInput label="Sitio web" placeholder="https://ejemplo.com" />
            <Input inputSize="lg" label="Large" placeholder="Tamaño grande" />
          </div>
        </DemoBlock>
        <DemoBlock title="Textarea y selects">
          <div className="space-y-3">
            <Textarea label="Descripción" maxLength={180} showCount placeholder="Describe tu proyecto..." />
            <Select label="Select" options={options} placeholder="Selecciona un país" />
            <NativeSelect label="Con grupos" groups={[{ label: "Latinoamérica", options }]} />
            <MultiSelect label="Selección múltiple" options={options} visibleRows={3} />
            <Combobox label="Combobox" options={options} placeholder="Escribe un país" />
            <Autocomplete label="Autocomplete" options={options} placeholder="Busca una opción" />
          </div>
        </DemoBlock>
        <DemoBlock title="Checkbox, Radio, Switch y Toggle">
          <div className="space-y-5">
            <Checkbox label="Acepto los términos" description="Control con estado indeterminado disponible." />
            <Checkbox indeterminate label="Selección parcial" variant="soft" />
            <div className="grid gap-3 sm:grid-cols-3">
              <Checkbox defaultChecked label="Card" variant="card" />
              <Checkbox defaultChecked label="Tile" variant="tile" />
              <Checkbox defaultChecked label="Button" variant="button" />
            </div>
            <CheckboxGroup name="channels" value={checkboxes} onChange={setCheckboxes} orientation="horizontal" variant="outline" options={[{ label: "Email", value: "email" }, { label: "SMS", value: "sms" }, { label: "Push", value: "push" }]} />
            <div className="grid gap-3 sm:grid-cols-3">
              <Radio label="Outline" name="radio-design" variant="outline" />
              <Radio label="Card" name="radio-design" variant="card" />
              <Radio label="Tile" name="radio-design" variant="tile" />
            </div>
            <RadioGroup name="billing" value={radio} onChange={setRadio} orientation="horizontal" variant="button" options={[{ label: "Mensual", value: "monthly" }, { label: "Anual", value: "yearly" }]} />
            <div className="flex flex-wrap items-center gap-5">
              <Switch checked={switchOn} onCheckedChange={setSwitchOn} label="Default" />
              <Switch defaultChecked variant="soft" label="Soft" />
              <Switch defaultChecked variant="icon" label="Con icono" />
              <Switch defaultChecked variant="gradient" label="Gradient" />
              <Switch defaultChecked variant="elevated" label="Elevated" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Toggle pressed>Default</Toggle>
              <Toggle pressed variant="outline">Outline</Toggle>
              <Toggle pressed variant="pill">Pill</Toggle>
              <Toggle pressed variant="elevated">Elevated</Toggle>
              <Toggle pressed variant="gradient">Gradient</Toggle>
            </div>
            <ToggleGroup value={toggles} onChange={setToggles} options={[{ label: "Lista", value: "list" }, { label: "Cuadrícula", value: "grid" }]} />
            <SegmentedControl value={segment} onChange={setSegment} options={[{ label: "Mensual", value: "monthly" }, { label: "Anual", value: "yearly" }]} />
          </div>
        </DemoBlock>
        <DemoBlock title="Layouts de formulario y controles avanzados">
          <FormSection
            title="Perfil comercial"
            description="Secciones, campos y agrupadores para formularios extensos."
            columns={2}
          >
            <FormField label="Dominio" htmlFor="domain" description="URL pública de tu espacio.">
              <InputGroup>
                <InputAddon>https://</InputAddon>
                <input id="domain" className="h-11 min-w-0 flex-1 border border-border bg-surface px-3 text-sm font-semibold outline-none focus:border-primary" defaultValue="nexora.dev" />
              </InputGroup>
            </FormField>
            <FloatingLabelInput label="Organización" defaultValue="Nexora Labs" />
            <Fieldset legend="Preferencias" description="Controles relacionados con semántica nativa." variant="soft" className="md:col-span-2">
              <Slider label="Intensidad de interfaz" defaultValue={72} valueSuffix="%" variant="gradient" />
              <ColorPicker label="Color de marca" />
            </Fieldset>
          </FormSection>
        </DemoBlock>
        <DemoBlock title="Fecha, OTP y Rating">
          <div className="space-y-4">
            <DateRangeInput />
            <div className="grid gap-3 sm:grid-cols-2"><DateInput label="Fecha" /><TimeInput label="Hora" /></div>
            <OTPInput value={otp} onChange={setOtp} />
            <div className="flex items-center gap-4"><Rating value={4} /><RatingInput value={rating} onChange={setRating} /></div>
          </div>
        </DemoBlock>
        <DemoBlock title="FileUpload, Dropzone e ImageUpload">
          <div className="space-y-4">
            <FileUpload files={files} onFilesChange={setFiles} multiple />
            <ImageUpload files={images} onFilesChange={setImages} multiple label="Selecciona imágenes" />
          </div>
        </DemoBlock>
        <AdvancedFormsShowcase />
        <AdvancedFormDesignSamples />
      </div>
    </ShowcaseSection>
  );
}
