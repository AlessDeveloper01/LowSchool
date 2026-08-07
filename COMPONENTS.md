# Componentes

Importación global opcional:

```tsx
import { Button, Card, Input } from "@/components";
```

La demostración interactiva está disponible en `/components`.

## Sistema universal de 10 diseños

Todas las familias visuales aceptan la prop opcional `design`. Los componentes
estructurales internos —como `CardHeader`, `TableCell` o los items del
`Sidebar`— heredan el diseño de su raíz.

```ts
type DesignPreset =
  | "minimal"
  | "outline"
  | "soft"
  | "elevated"
  | "glass"
  | "gradient"
  | "pill"
  | "sharp"
  | "brutalist"
  | "customized";
```

| Diseño | Intención |
|---|---|
| `minimal` | Sin ruido visual, fondos transparentes y hover discreto |
| `outline` | Bordes definidos y superficie neutra |
| `soft` | Fondo semántico tenue y bordes ligeros |
| `elevated` | Profundidad moderada y sombra tecnológica |
| `glass` | Transparencia, blur y borde luminoso |
| `gradient` | Composición intencional de primary, secondary y tertiary |
| `pill` | Forma completamente redondeada |
| `sharp` | Bordes rectos y geometría editorial |
| `brutalist` | Borde grueso y sombra desplazada |
| `customized` | Sin decisiones visuales; el cliente controla `className` |

`variant` mantiene el significado o comportamiento del componente, mientras
`design` controla su lenguaje visual:

```tsx
<Button variant="danger" design="glass">Eliminar</Button>
<Breadcrumb design="brutalist" items={items} />
<Sidebar design="gradient" items={navigation} />
<Input design="pill" label="Email" />
<Modal design="sharp" open={open} onOpenChange={setOpen} />
```

No se aplica ningún diseño por defecto desde esta prop, por lo que los usos
existentes conservan exactamente su apariencia. `className` y las clases de
slots siguen teniendo la última palabra.

### Cobertura de los diez diseños

| Familia | Componentes cubiertos |
|---|---|
| UI | Button y acciones, Card y composiciones, Surface, Tooltip, Popover, Kbd |
| Navegación | Breadcrumb, Sidebar, Navbar, menús móviles, Tabs, Accordion, Pagination, Dropdown, filtros, PageHeader, docks, NavRail y SpeedDial |
| Formularios | Input y especializados, Textarea, Select, Checkbox, Radio, Switch, Toggle, uploads, OTP, Rating, fecha/hora, rangos, Slider, ColorPicker, Tags, Quantity, búsqueda, teléfono, moneda y los cinco componentes Form |
| Datos | Badge, Avatar, imágenes, Table, DataTable, Carousel, Stepper, Timeline, DescriptionList, métricas, indicadores y tipografía visual |
| Feedback | Alert, Callout, Toast, Modal, Drawer, estados vacíos, loaders, Skeleton y todos los indicadores de progreso/estado |
| Compartidos y layout | Logo, controles de tema, usuario, Container, Section, Stack, Grid, composiciones y layouts de página |

`designPresets` también está exportado para construir selectores, documentación
o galerías sin duplicar los nombres:

```tsx
import { Breadcrumb, designPresets } from "@/components";

export function BreadcrumbDesignGallery() {
  return designPresets.map((design) => (
    <Breadcrumb
      key={design}
      design={design}
      items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Proyectos", href: "/dashboard/projects" },
        { label: design },
      ]}
      className={
        design === "customized"
          ? "rounded-2xl border-2 border-yellow-400 bg-yellow-400/10"
          : undefined
      }
    />
  ));
}
```

## Política responsive

Los estilos incluidos son mobile-first y están preparados desde 320 px:

- Grids, barras de acciones y formularios se apilan o envuelven antes de
  desbordar.
- Sidebar y navegación cambian a drawer o navegación móvil.
- Modales, drawers, popovers, dropdowns y tooltips respetan el viewport,
  utilizan scroll interno cuando hace falta y mantienen objetivos táctiles.
- Las tablas conservan su semántica y usan desplazamiento horizontal
  intencional; la columna de acciones permanece visible.
- Texto variable usa `min-w-0`, truncado o salto de palabra según el tipo de
  contenido.

La prop `className` mantiene prioridad para que cada proyecto pueda cambiar el
comportamiento. Por ello, clases personalizadas con anchos rígidos pueden
sobrescribir estas garantías y deben incluir sus propias reglas responsive.

## Personalización completa con `customized`

Los componentes visuales principales ofrecen `variant="customized"` (o
`appearance="customized"` en `Alert`). Esta variante mantiene el HTML
semántico, los estados, el teclado, los atributos ARIA y el tipado; evita
imponer colores y bordes para que el cliente defina su identidad con clases
Tailwind.

```tsx
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Switch,
  Toggle,
} from "@/components";

export function YellowBrandForm() {
  return (
    <Card
      variant="customized"
      className="rounded-[2rem] border-2 border-yellow-400 bg-zinc-950 p-6 text-yellow-50"
    >
      <Badge
        variant="customized"
        className="rounded-full bg-yellow-400 text-zinc-950"
      >
        PRO
      </Badge>

      <Input
        variant="customized"
        label="Proyecto"
        controlClassName="mt-5 rounded-2xl border-2 border-zinc-700 bg-zinc-900 px-4 focus-within:border-yellow-400 focus-within:ring-4 focus-within:ring-yellow-400/15"
        className="text-yellow-50 placeholder:text-zinc-500"
      />

      <Checkbox
        variant="customized"
        label="Activar publicación"
        className="mt-4 rounded-2xl border-2 border-zinc-700 p-4 has-checked:border-yellow-400 has-checked:bg-yellow-400/10"
        indicatorClassName="accent-yellow-400 focus-visible:outline-yellow-400"
      />

      <Switch
        variant="customized"
        label="Notificaciones"
        className="mt-4"
        trackClassName="bg-zinc-700 aria-checked:bg-yellow-400"
        thumbClassName="bg-zinc-950 text-yellow-400"
      />

      <Toggle
        variant="customized"
        className="mt-4 rounded-full border-2 border-zinc-700 text-zinc-300 aria-pressed:border-yellow-400 aria-pressed:bg-yellow-400 aria-pressed:text-zinc-950"
      >
        Modo compacto
      </Toggle>

      <Button
        variant="customized"
        className="mt-5 rounded-full bg-yellow-400 px-6 text-zinc-950 hover:bg-yellow-300"
      >
        Guardar
      </Button>

      <Alert
        appearance="customized"
        title="Estilo aplicado"
        className="mt-4 rounded-2xl border border-yellow-400/40 bg-yellow-400/10 text-yellow-200"
      />
    </Card>
  );
}
```

En componentes con varias capas:

- `className` personaliza el elemento principal.
- `Input.controlClassName` personaliza borde, fondo y forma del control;
  `Input.className` personaliza el `<input>`.
- `Checkbox` y `Radio` usan `indicatorClassName` para el control nativo.
- `Switch` usa `trackClassName` y `thumbClassName`.
- Las variantes de Tailwind `aria-pressed:*`, `aria-checked:*` y
  `has-checked:*` permiten diseñar estados sin lógica adicional.

## Button

Ruta: `src/components/ui/button.tsx` y `src/components/ui/button-actions.tsx`

```tsx
import {
  Button,
  IconButton,
  ButtonGroup,
  LoadingButton,
  CopyButton,
  BackButton,
  CloseButton,
  FloatingActionButton,
  LinkButton,
  SplitButton,
  IconTextButton,
  ShortcutButton,
  ToolbarButton,
  ProviderButton,
  NotificationButton,
  StatusButton,
} from "@/components/ui";
```

| Componente | Props principales | Variantes / tamaños | Uso |
|---|---|---|---|
| `Button` | `loading`, `fullWidth`, iconos, `shape`, `design` | 21 variantes, 10 diseños, 4 formas; `xs`–`xl`, `icon` | `<Button variant="glass" design="pill">Guardar</Button>` |
| `IconButton` | `label`, `children` | Hereda `Button` | `<IconButton label="Editar"><Pencil /></IconButton>` |
| `ButtonGroup` | `attached`, `orientation` | Horizontal, vertical | `<ButtonGroup attached>...</ButtonGroup>` |
| `LoadingButton` | Props de `Button` | Todas | `<LoadingButton>Guardando</LoadingButton>` |
| `CopyButton` | `value`, `copiedText` | Hereda `Button` | `<CopyButton value="ABC" />` |
| `BackButton` | `fallbackHref` | Hereda `Button` | `<BackButton />` |
| `CloseButton` | Props de icon button | Hereda `Button` | `<CloseButton onClick={close} />` |
| `FloatingActionButton` | Props de `Button` | Botón flotante | `<FloatingActionButton aria-label="Crear" />` |
| `LinkButton` | `href`, `variant`, `size` | Igual a Button | `<LinkButton href="/home">Inicio</LinkButton>` |
| `SplitButton` | `options` | Igual a Button | `<SplitButton options={items}>Guardar</SplitButton>` |
| `IconTextButton` | `icon`, `iconPosition`, props de Button | Icono izquierdo/derecho | `<IconTextButton icon={<Download />}>Descargar</IconTextButton>` |
| `ShortcutButton` | `shortcut`, props de Button | Uno o varios atajos | `<ShortcutButton shortcut={["Ctrl", "S"]}>Guardar</ShortcutButton>` |
| `ToolbarButton` | `icon`, `label`, `active`, `showLabel` | Compacto, activo/inactivo | `<ToolbarButton icon={<Bold />} label="Negrita" />` |
| `ProviderButton` | `providerName`, `icon` | Login/proveedores | `<ProviderButton providerName="GitHub" icon={<Github />} />` |
| `NotificationButton` | `count`, `maxCount`, `dot`, `icon` | Contador o punto | `<NotificationButton count={8} icon={<Bell />} label="Alertas" />` |
| `StatusButton` | `status`, `labels`, `icons` | `idle`, `loading`, `success`, `error` | `<StatusButton status="success" />` |

## Card

Ruta: `src/components/ui/card.tsx` y `src/components/ui/cards.tsx`

```tsx
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  CardFooter, CardActions, StatCard, ProfileCard, FeatureCard,
  PricingCard, ArticleCard, NotificationCard, EmptyCard,
  SelectionCard, DashboardCard,
} from "@/components/ui";
```

| Componente | Props principales | Variantes | Uso |
|---|---|---|---|
| `Card` | `padding`, `horizontal`, `selected`, `clickable` | 10 variantes, incluida `customized` | `<Card variant="soft">...</Card>` |
| `CardHeader` | Atributos `div` | — | `<CardHeader>...</CardHeader>` |
| `CardTitle` | Atributos `h3` | — | `<CardTitle>Proyecto</CardTitle>` |
| `CardDescription` | Atributos `p` | — | `<CardDescription>Detalle</CardDescription>` |
| `CardContent` | Atributos `div` | — | `<CardContent>...</CardContent>` |
| `CardFooter` | Atributos `div` | — | `<CardFooter>...</CardFooter>` |
| `CardActions` | Atributos `div` | — | `<CardActions>...</CardActions>` |
| `StatCard` | `label`, `value`, `change`, `trend`, `icon` | Hereda Card | `<StatCard label="Ventas" value="320" />` |
| `ProfileCard` | `name`, `role`, `avatar`, `actions` | Hereda Card | `<ProfileCard name="Ana" />` |
| `FeatureCard` | `title`, `description`, `icon`, `action` | Interactiva | `<FeatureCard title="API" description="..." />` |
| `PricingCard` | `name`, `price`, `features`, `highlighted` | Normal, destacada | `<PricingCard name="Pro" price="$29" features={[]} />` |
| `ArticleCard` | `title`, `excerpt`, `image`, `meta`, `href` | Hereda Card | `<ArticleCard title="Artículo" excerpt="..." />` |
| `NotificationCard` | `title`, `description`, `unread`, `actions` | Normal, no leída | `<NotificationCard title="Listo" description="..." />` |
| `EmptyCard` | `title`, `description`, `action`, `icon` | Hereda Card | `<EmptyCard />` |
| `SelectionCard` | `name`, `value`, `checked`, `onChange` | Seleccionada | `<SelectionCard name="plan" value="pro">Pro</SelectionCard>` |
| `DashboardCard` | `title`, `description`, `actions` | Hereda Card | `<DashboardCard title="Actividad">...</DashboardCard>` |

## Formularios base

Ruta: `src/components/ui/form/*`

```tsx
import { Form, FormInput, FormLabel, FormFeedback, FormSubmit } from "@/components/forms";
```

| Componente | Props principales | Variantes / tamaños | Uso |
|---|---|---|---|
| `Form` | `title`, `description`, `footer`, `spacing` | `plain`, `panel`, `outlined` | `<Form variant="panel">...</Form>` |
| `FormInput` | `status`, `leadingIcon`, `trailingElement` | `outline`, `filled`, `minimal`; `sm`–`lg` | `<FormInput status="success" />` |
| `FormLabel` | `required`, `optionalText`, `hint` | `sm`, `md`; `medium`, `strong` | `<FormLabel required>Nombre</FormLabel>` |
| `FormFeedback` | `tone`, `title`, `showIcon` | `inline`, `soft`, `outline` | `<FormFeedback tone="error">Error</FormFeedback>` |
| `FormSubmit` | `loading`, `fullWidth`, `leadingIcon` | 5 variantes; `sm`–`lg` | `<FormSubmit loading>Guardar</FormSubmit>` |

## Input y Textarea

Ruta: `src/components/forms/input.tsx` y `src/components/forms/textarea.tsx`

```tsx
import {
  Input, PasswordInput, SearchInput, NumberInput, CurrencyInput,
  EmailInput, PhoneInput, URLInput, Textarea,
} from "@/components/forms";
```

| Componente | Props principales | Variantes / tamaños | Uso |
|---|---|---|---|
| `Input` | `label`, estados, iconos, `controlClassName` | 9 variantes: `outline`, `filled`, `underlined`, `soft`, `minimal`, `glass`, `elevated`, `contrast`, `customized`; `sm`–`lg` | `<Input label="Nombre" />` |
| `PasswordInput` | Props de Input | Igual a Input | `<PasswordInput label="Contraseña" />` |
| `SearchInput` | `onClear` y props de Input | Igual a Input | `<SearchInput value={query} onClear={clear} />` |
| `NumberInput` | Props de Input | Igual a Input | `<NumberInput min={0} />` |
| `CurrencyInput` | `currencySymbol` | Igual a Input | `<CurrencyInput currencySymbol="$" />` |
| `EmailInput` | Props de Input | Igual a Input | `<EmailInput label="Email" />` |
| `PhoneInput` | Props de Input | Igual a Input | `<PhoneInput label="Teléfono" />` |
| `URLInput` | Props de Input | Igual a Input | `<URLInput label="Sitio web" />` |
| `Textarea` | `showCount`, `maxLength`, `resize`, estados | Igual a Input; `sm`–`lg` | `<Textarea showCount maxLength={200} />` |

## Composición y controles avanzados

Ruta: `src/components/forms/form-layout.tsx` y
`src/components/forms/range.tsx`

```tsx
import {
  ColorPicker,
  Fieldset,
  FloatingLabelInput,
  FormField,
  FormSection,
  InputAddon,
  InputGroup,
  Slider,
} from "@/components/forms";
```

| Componente | Props principales | Uso |
|---|---|---|
| `FormField` | `label`, `htmlFor`, `description`, `error`, `actions` | Agrupa etiqueta, control y mensaje |
| `FormSection` | `title`, `description`, `actions`, `columns` | Sección responsiva de 1–3 columnas |
| `Fieldset` | `legend`, `description`, `variant` | Grupo semántico de controles |
| `InputGroup` | `orientation`, `attached` | Adjunta inputs, botones o addons |
| `InputAddon` | `variant` | Prefijo o sufijo visual |
| `FloatingLabelInput` | Props nativas, `label`, `error` | Campo con etiqueta flotante |
| `Slider` | `label`, `showValue`, `valueSuffix`, `variant` | Rango controlado o no controlado |
| `ColorPicker` | `value`, `onValueChange`, `label` | Selector de identidad visual |

### Formularios especializados

Rutas: `src/components/forms/tag-input.tsx`, `quantity-input.tsx`,
`password-strength.tsx`, `search-field.tsx`, `advanced-fields.tsx` y
`pattern-input.tsx`.

| Componente | Props principales | Variantes / capacidades |
|---|---|---|
| `TagInput` | tags controlados/no controlados, validación, delimitadores, slots | 6 variantes; pegado múltiple, límites y teclado |
| `TokenInput` | Props de `TagInput` | Alias soft para tokens |
| `TagInputAddButton` | `onAdd` | Acción auxiliar accesible |
| `QuantityInput` | `value`, límites, `step`, `precision`, slots | `outline`, `soft`, `compact`, `pill`, `split`, `customized` |
| `StepperInput` | Props de `QuantityInput` | Variante split |
| `PasswordStrength` | `value`, reglas, estilos de barra | `bars`, `meter`, `checklist`, `compact`, `customized` |
| `PasswordStrengthInput` | Input + reglas y estado de fortaleza | Controlado/no controlado |
| `SearchField` | `suggestions`, filtro/render, estado abierto, slots | Combobox accesible con flechas, Enter y Escape |
| `AutocompleteField` | Props de `SearchField` | Abre sugerencias al enfocar |
| `PrefixField` | `prefix`, `suffix`, clases de slots | Extiende `Input` |
| `PhoneField` | países, valor internacional, país controlado | 6 variantes incluida `customized` |
| `CurrencyField` | moneda, locale, límites y decimales | Formato mediante `Intl.NumberFormat` |
| `PatternInput` | `pattern`, valor raw/formatted, placeholders | Máscara reutilizable sin dependencias |
| `CreditCardInput` | Props de `PatternInput`, `compact` | Máscara de tarjeta |
| `PostalCodeInput` | Props de `PatternInput` | Máscara postal |

## Select

Ruta: `src/components/forms/select.tsx`

```tsx
import { Select, NativeSelect, MultiSelect, Combobox, Autocomplete } from "@/components/forms";
```

| Componente | Props principales | Tamaños | Uso |
|---|---|---|---|
| `Select` | `options`, `groups`, `placeholder`, estados | `sm`, `md`, `lg` | `<Select options={options} />` |
| `NativeSelect` | Igual a Select + atributos nativos | `sm`, `md`, `lg` | `<NativeSelect groups={groups} />` |
| `MultiSelect` | `visibleRows`, props de Select | `sm`, `md`, `lg` | `<MultiSelect multiple options={options} />` |
| `Combobox` | `options`, `listId`, props de Input | Input | `<Combobox options={options} />` |
| `Autocomplete` | Alias claro de Combobox | Input | `<Autocomplete options={options} />` |

## Checkbox, Radio, Switch y Toggle

Rutas: `src/components/forms/choice.tsx` y `src/components/forms/toggle.tsx`

```tsx
import {
  Checkbox, CheckboxGroup, Radio, RadioGroup,
  Switch, Toggle, ToggleGroup, SegmentedControl,
} from "@/components/forms";
```

| Componente | Props principales | Variantes / tamaños | Uso |
|---|---|---|---|
| `Checkbox` | `label`, `description`, `error`, `indeterminate`, `indicatorClassName` | 8 variantes: `default`, `outline`, `soft`, `minimal`, `card`, `tile`, `button`, `customized`; `sm`–`lg` | `<Checkbox label="Aceptar" />` |
| `CheckboxGroup` | `options`, `value`, `onChange`, `orientation` | Igual a Checkbox | `<CheckboxGroup name="roles" options={options} />` |
| `Radio` | `label`, `description`, `error`, `indicatorClassName` | Las mismas 8 variantes; `sm`–`lg` | `<Radio name="plan" label="Pro" />` |
| `RadioGroup` | `options`, `value`, `onChange`, `orientation` | Igual a Radio | `<RadioGroup name="plan" options={options} />` |
| `Switch` | Controlado/no controlado, textos, iconos, clases de track/thumb | 8 variantes; `sm`–`lg` | `<Switch label="Activo" />` |
| `Toggle` | `pressed`, `onPressedChange` | 8 variantes, incluida `customized`; `sm`–`lg` | `<Toggle>Negrita</Toggle>` |
| `ToggleGroup` | `options`, `value`, `multiple` | `sm`–`lg` | `<ToggleGroup options={options} />` |
| `SegmentedControl` | `options`, `value`, `onChange` | `sm`–`lg` | `<SegmentedControl options={options} />` |

## Métricas y micrográficas

Rutas: `src/components/data-display/metrics.tsx` y `micro-charts.tsx`

| Componente | Props principales | Variantes / uso |
|---|---|---|
| `TrendIndicator` | `direction`, `value`, `inverse`, `showIcon` | Tendencia positiva, negativa o neutral |
| `Metric` | label, value, icono, trend, footer y clases de slots | 6 variantes incluida `customized`; `sm`–`lg` |
| `MetricGroup` | `columns`, `divided` | Grupo responsivo de 1–4 columnas |
| `Kpi` | `value`, `target`, `progress`, `status` | En objetivo, en riesgo o fuera |
| `Meter` | rango, marker, label, slots | 8 tonos incluida personalización total |
| `Gauge` | rango, tamaño, grosor y colores | Medidor circular accesible |
| `SparkBars` | `values`, `height`, `gap`, highlight | Micrográfica de barras |
| `ComparisonBar` | dos valores y etiquetas, clases de slots | Comparación proporcional |

## Badge, Avatar e Image

Rutas: `src/components/data-display/badge.tsx`, `avatar.tsx`, `image.tsx`

```tsx
import {
  Badge, StatusBadge, Tag, Chip, Avatar, AvatarGroup, EditableAvatar,
  ResponsiveImage, Thumbnail, ImagePreview, ImageGallery, ImageOverlay,
} from "@/components/data-display";
```

| Componente | Props principales | Variantes / tamaños | Uso |
|---|---|---|---|
| `Badge` | `dot`, `icon`, `counter`, `shape` | 11 variantes, incluidas `gradient` y `customized`; `sm`–`lg` | `<Badge variant="success">Activo</Badge>` |
| `StatusBadge` | `status`, `label` | 10 estados | `<StatusBadge status="processing" />` |
| `Tag` | `removable`, `onRemove` | Badge outline | `<Tag removable>React</Tag>` |
| `Chip` | `selected`, `onSelectedChange` | Seleccionado/no seleccionado | `<Chip selected>Filtro</Chip>` |
| `Avatar` | `src`, `alt`, `name`, `status`, `ring` | 3 formas; `xs`–`2xl` | `<Avatar alt="Ana" name="Ana Torres" />` |
| `AvatarGroup` | `max`, `size` | `xs`–`2xl` | `<AvatarGroup max={3}>...</AvatarGroup>` |
| `EditableAvatar` | Props de Avatar, `onEdit` | Igual a Avatar | `<EditableAvatar alt="Ana" onEdit={edit} />` |
| `ResponsiveImage` | `aspectRatio`, `fit`, `variant`, `fallback` | 7 variantes | `<ResponsiveImage src="/img.jpg" alt="..." />` |
| `Thumbnail` | Props de imagen | Thumbnail | `<Thumbnail src="/img.jpg" alt="..." />` |
| `ImagePreview` | `zoomable` | Preview modal | `<ImagePreview src="/img.jpg" alt="..." />` |
| `ImageGallery` | `images` | Grid responsivo | `<ImageGallery images={images} />` |
| `ImageOverlay` | `position`, `children` | Top, center, bottom | `<ImageOverlay ...>Título</ImageOverlay>` |

## Logo

Ruta: `src/components/shared/logo.tsx`

```tsx
import { Logo } from "@/components/shared";
```

| Componente | Props principales | Variantes / tamaños | Uso |
|---|---|---|---|
| `Logo` | `name`, `subtitle`, `icon`, `image`, `href`, `mode` | 6 variantes; `sm`–`lg` | `<Logo name="Nexora" variant="horizontal" />` |

## Alert y Toast

Rutas: `src/components/feedback/alert.tsx` y `toast.tsx`

```tsx
import { Alert, InlineMessage, Banner, ToastProvider, useToast } from "@/components/feedback";
```

| Componente | Props principales | Variantes | Uso |
|---|---|---|---|
| `Alert` | `title`, `description`, `dismissible`, acciones | 5 tonos; `solid`, `soft`, `outline`, `customized` | `<Alert variant="success" title="Guardado" />` |
| `InlineMessage` | Props de Alert | Soft compacto | `<InlineMessage>Ayuda</InlineMessage>` |
| `Banner` | Props de Alert | Banner completo | `<Banner variant="info" />` |
| `ToastProvider` | `position`, `maxVisible` | 6 posiciones | `<ToastProvider>{children}</ToastProvider>` |
| `useToast` | `toast`, `dismiss`, `dismissAll` | 5 variantes | `toast({ title: "Listo", variant: "success" })` |

### Callouts, estados y actividad

| Componente | Props principales | Variantes / uso |
|---|---|---|
| `Callout` | tono, appearance, eyebrow, acciones, dismiss y slots | 8 tonos y 6 apariencias, ambas con `customized` |
| `Announcement` | `title`, `description`, badge, acción, dismiss | `primary`, `gradient`, `neutral`, `customized` |
| `StatusBeacon` | `status`, `size`, `pulse`, `label` | 6 estados incluida personalización |
| `ConnectionStatus` | `status`, `compact`, `action`, slots | Conectado, conectando, desconectado, error |
| `NotificationItem` | contenido, timestamp, unread, acciones, dismiss | 6 tonos y estados de lectura |
| `ActivityFeed` | `lineClassName` | Contenedor semántico de eventos |
| `ActivityEvent` | contenido, timestamp, icono, meta y slots | 6 variantes incluida `customized` |

## Modal y Dialog

Ruta: `src/components/feedback/modal.tsx`

```tsx
import { Modal, Dialog, AlertDialog, ConfirmDialog, Drawer, Sheet, BottomSheet } from "@/components/feedback";
```

| Componente | Props principales | Variantes / tamaños | Uso |
|---|---|---|---|
| `Modal` | `open`, `onOpenChange`, `title`, `footer` | 5 variantes; `sm`–`full` | `<Modal open={open} onOpenChange={setOpen} title="Editar" />` |
| `Dialog` | Alias de Modal | Igual a Modal | `<Dialog ... />` |
| `AlertDialog` | `onConfirm`, labels, `loading` | Destructivo | `<AlertDialog onConfirm={remove} ... />` |
| `ConfirmDialog` | `onConfirm`, labels, `loading` | Normal/destructivo | `<ConfirmDialog onConfirm={save} ... />` |
| `Drawer` | `side`, `width`, props de overlay | 4 lados; `sm`–`lg` | `<Drawer side="right" ... />` |
| `Sheet` | Alias de Drawer | Igual a Drawer | `<Sheet ... />` |
| `BottomSheet` | Props de Drawer | Inferior | `<BottomSheet ... />` |

## Dropdown, Tooltip, Tabs y Accordion

Rutas: `src/components/navigation/*`, `src/components/ui/tooltip.tsx`, `popover.tsx`

```tsx
import {
  DropdownMenu, ContextMenu, UserDropdown, ActionMenu,
  Tabs, Accordion, AccordionItem, Collapsible,
} from "@/components/navigation";
import { Tooltip, Popover } from "@/components/ui";
```

| Componente | Props principales | Variantes | Uso |
|---|---|---|---|
| `DropdownMenu` | `trigger`, `items`, `align`, controlado | Normal/destructivo/disabled | `<DropdownMenu trigger={button} items={items} />` |
| `ContextMenu` | `items`, `children` | Menú contextual | `<ContextMenu items={items}>...</ContextMenu>` |
| `UserDropdown` | `name`, `email`, callbacks | Perfil/logout | `<UserDropdown name="Ana" />` |
| `ActionMenu` | `items` | Botón de acciones | `<ActionMenu items={items} />` |
| `Tooltip` | `content`, `position`, `delay`, `arrow` | `dark`, `light`, `compact`, `rich` | `<Tooltip label="Ayuda"><button /></Tooltip>` |
| `Popover` | `trigger`, controlado/no controlado, `position` | 4 posiciones | `<Popover trigger={button}>...</Popover>` |
| `Tabs` | `items`, controlado/no controlado, `orientation` | 5 variantes | `<Tabs items={tabs} />` |
| `Accordion` | `items`, `multiple`, controlado/no controlado | Uno/múltiples | `<Accordion items={items} />` |
| `AccordionItem` | `item`, `open`, `onToggle` | Abierto/cerrado | `<AccordionItem item={item} ... />` |
| `Collapsible` | `trigger`, controlado/no controlado | Abierto/cerrado | `<Collapsible trigger="Más">...</Collapsible>` |

## Table y DataTable

Rutas: `src/components/data-display/table.tsx` y `data-table.tsx`

```tsx
import {
  Table, TableHeader, TableBody, TableFooter, TableRow, TableHead,
  TableCell, TableCaption, TableEmpty, TableLoading, TableActions,
  TableFilters, DataTable,
} from "@/components/data-display";
```

| Componente | Props principales | Variantes | Uso |
|---|---|---|---|
| `Table` | `variant`, `stickyHeader`, `surface` | 7 variantes; superficie contenida o plana | `<Table variant="striped" surface="plain">...</Table>` |
| `TableHeader` | Atributos `thead` | — | `<TableHeader>...</TableHeader>` |
| `TableBody` | Atributos `tbody` | — | `<TableBody>...</TableBody>` |
| `TableFooter` | Atributos `tfoot` | — | `<TableFooter>...</TableFooter>` |
| `TableRow` | `selected` | Normal/seleccionada | `<TableRow selected />` |
| `TableHead` | Atributos `th`, `align` | `start`, `end`, `center`, `left`, `right` | `<TableHead align="center">Nombre</TableHead>` |
| `TableCell` | Atributos `td`, `align` | `start`, `end`, `center`, `left`, `right` | `<TableCell align="end">Ana</TableCell>` |
| `TableCaption` | Atributos `caption` | — | `<TableCaption>Usuarios</TableCaption>` |
| `TableEmpty` | `colSpan`, `message` | Vacío | `<TableEmpty colSpan={4} />` |
| `TableLoading` | `colSpan` | Loading | `<TableLoading colSpan={4} />` |
| `TableFilters` | búsqueda, `groups`, valores, panel controlado/no controlado, `surface`, `classNames` | Simple, múltiple, plegable, oculto | `<TableFilters groups={groups} surface="plain" defaultOpen />` |
| `TableActions` | `actions`, `variant`, `align`, `classNames`, `design` | `icons`, `dropdown`, `buttons` | `<TableActions actions={actions} variant="icons" />` |
| `DataTable` | `data`, `columns`, filtros, búsqueda, selección, paginación, acciones, superficies | Loading/empty/sort, filtros conectados y 3 modos de acciones | `<DataTable data={data} columns={columns} filterGroups={groups} surface="plain" />` |

### Filtros conectados a DataTable

Cada grupo define sus opciones y cómo obtener el valor desde una fila.
Los grupos simples muestran un selector; los múltiples utilizan opciones
táctiles con `aria-pressed`. Los grupos se combinan con `AND` y las opciones
seleccionadas dentro de un mismo grupo con `OR`.

```tsx
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilterGroup,
} from "@/components";

interface Member {
  id: string;
  name: string;
  role: string;
  status: "Activo" | "Pendiente" | "Inactivo";
}

type MemberFilterId = "status" | "role";

const columns = [
  { key: "name", header: "Nombre", sortable: true },
  { key: "role", header: "Rol", sortable: true, align: "center" },
  { key: "status", header: "Estado", align: "end" },
] satisfies DataTableColumn<Member>[];

const memberFilters = [
  {
    id: "status",
    label: "Estado",
    placeholder: "Todos los estados",
    options: [
      { value: "Activo", label: "Activo" },
      { value: "Pendiente", label: "Pendiente" },
      { value: "Inactivo", label: "Inactivo" },
    ],
    getValue: (member) => member.status,
  },
  {
    id: "role",
    label: "Roles",
    multiple: true,
    options: [
      { value: "Diseño", label: "Diseño" },
      { value: "Desarrollo", label: "Desarrollo" },
      { value: "Soporte", label: "Soporte" },
    ],
    getValue: (member) => member.role,
  },
] satisfies readonly DataTableFilterGroup<Member, MemberFilterId>[];

export function MembersTable({ members }: { members: Member[] }) {
  return (
    <DataTable<Member, MemberFilterId>
      data={members}
      columns={columns}
      getRowId={(member) => member.id}
      getSearchText={(member) =>
        `${member.name} ${member.role} ${member.status}`
      }
      searchPlaceholder="Buscar integrantes..."
      filterGroups={memberFilters}
      defaultFilterValues={{ status: "Activo" }}
      filtersCollapsible
      defaultFiltersOpen={false}
      showFilterPanel
      filterDesign="soft"
    />
  );
}
```

Control y visibilidad:

- `searchValue` / `defaultSearchValue` controlan la búsqueda por texto.
- `filterValues` / `defaultFilterValues` controlan las opciones seleccionadas.
- `filtersOpen` / `defaultFiltersOpen` controlan el panel plegable.
- `filtersCollapsible={false}` mantiene las opciones siempre visibles.
- `showFilterPanel={false}` oculta el panel de opciones sin eliminar la
  búsqueda; los valores controlados que sigan activos continuarán filtrando.
- `hidden` puede ocultar grupos u opciones según permisos o contexto.
- `getSearchText` limita qué información se busca; `searchPredicate` permite
  reemplazar completamente la lógica de coincidencia.

### Superficies independientes

Los fondos que agrupan tabla y filtros son opcionales. `surface="plain"` quita
el fondo, borde, radio, sombra y blur del contenedor, manteniendo cada input,
chip y acción como control independiente. `surface="contained"` conserva la
superficie agrupada.

```tsx
// Todo plano: útil cuando la página ya proporciona su propio contenedor.
<DataTable
  data={members}
  columns={columns}
  filterGroups={memberFilters}
  surface="plain"
/>

// Mezcla libre: raíz plana, filtros planos y tabla contenida.
<DataTable
  data={members}
  columns={columns}
  filterGroups={memberFilters}
  surface="plain"
  filterSurface="plain"
  tableSurface="contained"
/>
```

- `surface` establece el modo general de `DataTable`.
- `filterSurface` sobrescribe únicamente el panel de filtros.
- `tableSurface` sobrescribe únicamente el contenedor desplazable de la tabla.
- `Table` y `TableFilters` también aceptan `surface` al usarlos por separado.
- `className`, `containerClassName` y `classNames` siguen disponibles para
  personalización final.

### Acciones configurables por fila

`rowActions` puede recibir un arreglo fijo o una función que construye las
acciones para cada registro. `actionsVariant` cambia únicamente su
presentación:

- `icons`: cubos compactos con icono, tooltip y `aria-label`.
- `dropdown`: una sola acción visible que abre el menú completo.
- `buttons`: botones completos con icono y texto.

```tsx
import {
  DataTable,
  type DataTableColumn,
  type TableAction,
  type TableActionsVariant,
} from "@/components";
import { LuEye, LuPencil, LuTrash2 } from "react-icons/lu";

interface Project {
  id: string;
  name: string;
  locked: boolean;
}

const columns = [
  { key: "name", header: "Proyecto", sortable: true },
] satisfies DataTableColumn<Project>[];

interface ProjectsTableProps {
  projects: Project[];
  actionsVariant?: TableActionsVariant;
  onEdit: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

export function ProjectsTable({
  projects,
  actionsVariant = "icons",
  onEdit,
  onDelete,
}: ProjectsTableProps) {
  function projectActions(project: Project): TableAction[] {
    return [
      {
        id: "view",
        label: `Ver ${project.name}`,
        icon: <LuEye />,
        href: `/projects/${project.id}`,
      },
      {
        id: "edit",
        label: "Editar",
        icon: <LuPencil />,
        disabled: project.locked,
        onSelect: () => onEdit(project.id),
      },
      {
        id: "delete",
        label: "Eliminar",
        icon: <LuTrash2 />,
        destructive: true,
        onSelect: () => onDelete(project.id),
      },
    ];
  }

  return (
    <DataTable<Project>
      data={projects}
      columns={columns}
      getRowId={(project) => project.id}
      rowActions={projectActions}
      actionsVariant={actionsVariant}
      actionsDesign="soft"
      actionClassNames={{
        action: "border border-border",
        trigger: "bg-primary/10 text-primary",
      }}
    />
  );
}
```

La prop anterior `actions={(row) => ReactNode}` continúa disponible para
renderizado totalmente manual. Cuando se utiliza `rowActions`, `icons` es el
modo predeterminado.

## Pagination y Breadcrumb

Ruta: `src/components/navigation/pagination.tsx` y `breadcrumb.tsx`

| Componente | Props principales | Tamaños | Uso |
|---|---|---|---|
| `Pagination` | `currentPage`, `totalPages`, `onPageChange` | `sm`, `md`, `lg` | `<Pagination currentPage={1} totalPages={10} ... />` |
| `SimplePagination` | `onPrevious`, `onNext` | Compacta | `<SimplePagination currentPage={1} totalPages={10} ... />` |
| `Breadcrumb` | `items`, `separator`, `maxItems`, `homeHref` | Responsive | `<Breadcrumb items={items} />` |

## Navbar, Sidebar y navegación móvil

Rutas: `src/components/navigation/navbar.tsx`, `sidebar.tsx`, `mobile-navigation.tsx`

```tsx
import {
  Navbar, PublicNavbar, DashboardNavbar, MobileNavbar, Sidebar,
  SidebarHeader, SidebarContent, SidebarGroup, SidebarFooter,
  SidebarTrigger, MobileMenu, BottomNavigation,
} from "@/components/navigation";
```

| Componente | Props principales | Variantes | Uso |
|---|---|---|---|
| `Navbar` | `logo`, `links`, acciones, búsqueda, usuario | 8 variantes | `<Navbar logo={logo} links={links} />` |
| `PublicNavbar` | Props de Navbar | Blurred | `<PublicNavbar links={links} />` |
| `DashboardNavbar` | Props de Navbar | Bordered | `<DashboardNavbar links={links} />` |
| `MobileNavbar` | Props de Navbar | Solo móvil | `<MobileNavbar links={links} />` |
| `Sidebar` | `items`, header/footer, controlado/no controlado | 4 variantes; expanded/collapsed/mobile | `<Sidebar items={items} />` |
| `SidebarHeader` | Atributos `div` | — | `<SidebarHeader>Logo</SidebarHeader>` |
| `SidebarContent` | Atributos `div` | — | `<SidebarContent>...</SidebarContent>` |
| `SidebarGroup` | `label`, `children` | — | `<SidebarGroup label="General">...</SidebarGroup>` |
| `SidebarFooter` | Atributos `div` | — | `<SidebarFooter>...</SidebarFooter>` |
| `SidebarTrigger` | `collapsed`, `onClick` | Expandir/colapsar | `<SidebarTrigger collapsed={false} ... />` |
| `MobileMenu` | `open`, `items`, `onOpenChange` | Drawer móvil | `<MobileMenu open={open} items={items} ... />` |
| `BottomNavigation` | `items` | Navegación inferior | `<BottomNavigation items={items} />` |

## Acciones de navegación

Rutas: `src/components/navigation/action-dock.tsx`, `nav-rail.tsx` y
`speed-dial.tsx`

| Componente | Props principales | Variantes / uso |
|---|---|---|
| `ActionDock` | `actions`, `orientation`, `size`, `showLabels`, clases de slots | `default`, `floating`, `glass`, `customized` |
| `FloatingToolbar` | Props de `ActionDock` | Toolbar elevada |
| `CommandTrigger` | `label`, `shortcut`, `leadingIcon`, props de botón | `default`, `compact`, `minimal`, `customized` |
| `NavRail` | `items`, `showLabels`, `itemClassName` | `minimal`, `soft`, `floating`, `customized` |
| `SpeedDial` | `actions`, estado abierto, `direction`, clases de slots | `primary`, `secondary`, `glass`, `customized` |

## PageHeader y Layouts

Rutas: `src/components/navigation/page-header.tsx` y `src/components/layout/*`

| Componente | Props principales | Variantes / tamaños | Uso |
|---|---|---|---|
| `PageHeader` | breadcrumb, título, descripción, badge, acciones | Responsive | `<PageHeader title="Proyectos" />` |
| `Container` | `size` | `sm`, `md`, `lg`, `xl`, `full` | `<Container>...</Container>` |
| `Section` | `spacing` | `sm`–`xl` | `<Section>...</Section>` |
| `Stack` | `gap`, `align` | 6 gaps | `<Stack gap="md">...</Stack>` |
| `Inline` | `gap`, `align`, `wrap` | 6 gaps | `<Inline>...</Inline>` |
| `Grid` | `columns`, `gap` | 1–6 columnas | `<Grid columns={3}>...</Grid>` |
| `Divider` | `label` | Con/sin label | `<Divider label="O" />` |
| `ScrollArea` | Atributos `div` | Scroll nativo | `<ScrollArea>...</ScrollArea>` |
| `PageLayout` | header/footer/children | Página | `<PageLayout header={header}>...</PageLayout>` |
| `DashboardLayout` | header/sidebar/children | Dashboard | `<DashboardLayout sidebar={sidebar}>...</DashboardLayout>` |
| `AuthLayout` | title/description/visual | Auth | `<AuthLayout title="Acceso">...</AuthLayout>` |
| `PublicLayout` | header/footer/children | Público | `<PublicLayout>...</PublicLayout>` |

### Composición avanzada

| Componente | Props principales | Uso |
|---|---|---|
| `Center` | `maxWidth`, `gutters`, `intrinsic` | Centra y limita contenido |
| `Cluster` | `justify`, `align`, `gap` | Agrupa elementos con wrapping |
| `Cover` | `minHeight`, `centered` | Composición vertical de altura mínima |
| `Bleed` | `inline`, `block` | Extiende contenido fuera del gutter |
| `VisuallyHidden` | Atributos de `span` | Texto accesible solo para lectores |
| `AspectRatioBox` | `ratio` | `square`, `video`, `portrait`, `wide`, `customized` |
| `SplitLayout` | `ratio`, `align` | Layout de dos zonas responsivo |
| `AutoGrid` | `minItemWidth`, `gap` | Grid auto-fit sin breakpoints manuales |
| `Masonry` | `columns`, `gap` | Columnas de altura variable |
| `StickyRegion` | `offset` | Región sticky configurable |

## Surface y datos descriptivos

Rutas: `src/components/ui/surface.tsx` y
`src/components/data-display/description-list.tsx`

| Componente | Props principales | Variantes / uso |
|---|---|---|
| `Surface` | `variant`, `padding` | `default`, `subtle`, `inset`, `elevated`, `glass`, `gradient`, `grid`, `customized` |
| `SurfaceHeader` | `eyebrow`, `title`, `description`, `actions` | Encabezado composable |
| `SurfaceContent` | Atributos `div` | Contenido con espaciado |
| `GradientBorder` | `innerClassName` | Contenedor con borde de tres colores |
| `DescriptionList` | `columns`, `divided` | Lista semántica de 1–3 columnas |
| `DescriptionItem` | `term`, `details`, `icon`, `orientation` | Par término/valor |
| `KeyValue` | `label`, `value`, `supportingText`, slots | Dato compacto con icono y acción |

## Estados y loaders

Rutas: `src/components/feedback/states.tsx` y `loaders.tsx`

| Componente | Props principales | Tamaños / estados | Uso |
|---|---|---|---|
| `EmptyState` | icono, textos, acciones | `compact`, `full` | `<EmptyState />` |
| `ErrorState` | Props de EmptyState | Error | `<ErrorState />` |
| `LoadingState` | Props de EmptyState | Loading | `<LoadingState />` |
| `OfflineState` | Props de EmptyState | Offline | `<OfflineState />` |
| `NotFoundState` | Props de EmptyState | 404 | `<NotFoundState />` |
| `PermissionDeniedState` | Props de EmptyState | Permisos | `<PermissionDeniedState />` |
| `NoResultsState` | Props de EmptyState | Sin resultados | `<NoResultsState />` |
| `MaintenanceState` | Props de EmptyState | Mantenimiento | `<MaintenanceState />` |
| `Spinner` | `size`, `className` | `sm`, `md`, `lg` | `<Spinner />` |
| `LoadingDots` | `className` | — | `<LoadingDots />` |
| `ProgressBar` | `value`, `showValue` | 0–100 | `<ProgressBar value={70} />` |
| `CircularProgress` | `value`, `showValue` | 0–100 | `<CircularProgress value={70} />` |
| `SegmentedProgress` | `value`, `segments`, `tone`, `size`, slots | Progreso segmentado con 8 tonos |
| `ProgressRing` | `value`, tamaño, grosor, tono, label | Anillo accesible y configurable |
| `FileProgress` | archivo, valor, estado, cancelar, slots | Uploading, complete o error |
| `Skeleton` | `variant`, `animation`, `width`, `height` | 5 formas; `pulse`, `wave`, `none` | `<Skeleton variant="circular" />` |
| `TextSkeleton` | `lines`, `lastLineWidth`, `animation` | Párrafos variables | `<TextSkeleton lines={4} />` |
| `AvatarSkeleton` | `size` | `sm`, `md`, `lg` | `<AvatarSkeleton />` |
| `CardSkeleton` | Sin props | Card | `<CardSkeleton />` |
| `ProfileSkeleton` | Sin props | Perfil | `<ProfileSkeleton />` |
| `ListSkeleton` | `items` | Lista | `<ListSkeleton items={4} />` |
| `FormSkeleton` | `fields` | Formulario | `<FormSkeleton fields={3} />` |
| `ChartSkeleton` | Sin props | Gráfica | `<ChartSkeleton />` |
| `TableSkeleton` | `rows` | Filas configurables | `<TableSkeleton rows={5} />` |
| `DashboardSkeleton` | Sin props | Dashboard compuesto | `<DashboardSkeleton />` |
| `PageLoader` | `label`, `description`, `value`, `icon`, `variant`, `tone`, `layout`, `surface`, `design`, `action` | 8 animaciones; determinado o indeterminado | `<PageLoader variant="icon-fill" value={64} />` |

### PageLoader con iconos y progreso

`PageLoader` acepta cualquier icono React y lo rellena de abajo hacia arriba
cuando recibe `value`. Sin `value` funciona como estado indeterminado y omite el
porcentaje.

```tsx
import { PageLoader } from "@/components/feedback";
import { LuCloudUpload, LuShieldCheck } from "react-icons/lu";

<PageLoader
  variant="icon-fill"
  icon={<LuCloudUpload />}
  value={uploadProgress}
  tone="primary"
  label="Subiendo archivos"
  description="Puedes continuar cuando llegue al 100%."
  layout="section"
  surface="plain"
/>

<PageLoader
  variant="ring"
  icon={<LuShieldCheck />}
  value={verificationProgress}
  tone="secondary"
  surface="contained"
  design="soft"
  action={<button type="button">Cancelar</button>}
/>
```

Variantes disponibles: `spinner`, `icon-fill`, `ring`, `orbit`, `steps`,
`scanner`, `pulse` y `minimal`. Los tonos son `primary`, `secondary`,
`tertiary` y `gradient`; los layouts son `compact`, `section` y `screen`.

## Typography

Ruta: `src/components/data-display/typography.tsx`

```tsx
import {
  Heading, Text, Paragraph, Label, Caption, Code,
  TypographyKbd, Blockquote, TruncatedText,
} from "@/components/data-display";
```

| Componente | Props principales | Variantes / tamaños | Uso |
|---|---|---|---|
| `Heading` | `as`, `tone`, `size` | 6 tonos; `xs`–`4xl` | `<Heading as="h1">Título</Heading>` |
| `Text` | `as`, `tone`, `size` | 6 tonos; `xs`–`4xl` | `<Text tone="muted">Texto</Text>` |
| `Paragraph` | Props de Text | Igual a Text | `<Paragraph>Contenido</Paragraph>` |
| `Label` | Props de Text | Igual a Text | `<Label>Etiqueta</Label>` |
| `Caption` | Props de Text | Igual a Text | `<Caption>Hace 2 min</Caption>` |
| `Code` | Props de Text | Igual a Text | `<Code>npm run dev</Code>` |
| `TypographyKbd` | Props de Text | Igual a Text | `<TypographyKbd>Ctrl K</TypographyKbd>` |
| `Blockquote` | Props de Text | Igual a Text | `<Blockquote>Cita</Blockquote>` |
| `TruncatedText` | `lines` | 1–3 líneas | `<TruncatedText lines={2}>...</TruncatedText>` |

## User y Theme

Rutas: `src/components/shared/user-components.tsx` y `theme-controls.tsx`

| Componente | Props principales | Estados | Uso |
|---|---|---|---|
| `UserMenu` | datos de usuario, items, callbacks | Abierto/cerrado | `<UserMenu name="Ana" />` |
| `UserSummary` | `name`, `email`, `role`, `avatar`, `compact` | Compacto/completo | `<UserSummary name="Ana" />` |
| `UserListItem` | datos, `trailing`, `onClick` | Interactivo | `<UserListItem name="Ana" />` |
| `UserProfileCard` | Props de ProfileCard | Card | `<UserProfileCard name="Ana" />` |
| `AccountSwitcher` | `accounts`, `activeId`, `onChange` | Dropdown | `<AccountSwitcher accounts={items} ... />` |
| `RoleBadge` | `role` | Badge | `<RoleBadge role="Admin" />` |
| `UserStatus` | `status`, `showLabel` | 4 estados | `<UserStatus status="online" />` |
| `NotificationBell` | `count`, `onClick` | Con contador | `<NotificationBell count={4} />` |
| `LogoutButton` | Props de Button | Ghost | `<LogoutButton>Cerrar sesión</LogoutButton>` |
| `ThemeToggle` | `className` | Claro/oscuro | `<ThemeToggle />` |
| `ThemeSelector` | `value`, `onChange` | Light/dark/system | `<ThemeSelector />` |
| `AppearanceSelector` | Props de ThemeSelector | Light/dark/system | `<AppearanceSelector />` |

## Search y filtros

Ruta: `src/components/navigation/search-filters.tsx`

| Componente | Props principales | Uso |
|---|---|---|
| `SearchInput` | Se importa desde forms; props de Input | `<SearchInput placeholder="Buscar" />` |
| `FilterBar` | `search`, `filters`, `actions` | `<FilterBar search={input} />` |
| `FilterButton` | Props de Button, `count` | `<FilterButton count={2} />` |
| `FilterChip` | `label`, `onRemove` | `<FilterChip label="Activo" />` |
| `ActiveFilters` | `filters`, `onRemove`, `onClear` | `<ActiveFilters filters={filters} ... />` |
| `SortButton` | `items`, `label` | `<SortButton items={items} />` |
| `SortMenu` | Props de DropdownMenu | `<SortMenu items={items} trigger={button} />` |
| `ClearFiltersButton` | Props de Button | `<ClearFiltersButton />` |
| `DateFilter` | `label`, `value`, `onChange` | `<DateFilter />` |
| `RangeFilter` | min/max/value/onChange | `<RangeFilter value={range} />` |

## Stepper, Timeline, uploads y utilidades

| Componente | Ruta | Props principales | Uso |
|---|---|---|---|
| `Stepper` | `data-display/stepper.tsx` | `steps`, `currentStep`, `orientation`, `variant` | `<Stepper steps={steps} />` |
| `Timeline` | `data-display/timeline.tsx` | `items`, `variant` | `<Timeline items={items} />` |
| `FileUpload` | `forms/file-upload.tsx` | archivos, accept, tamaño, multiple | `<FileUpload files={files} onFilesChange={setFiles} />` |
| `ImageUpload` | `forms/file-upload.tsx` | Props de upload, preview | `<ImageUpload files={files} ... />` |
| `Dropzone` | `forms/file-upload.tsx` | Alias de FileUpload | `<Dropzone files={files} ... />` |
| `DateInput` | `forms/date-time-inputs.tsx` | Props de Input | `<DateInput />` |
| `TimeInput` | `forms/date-time-inputs.tsx` | Props de Input | `<TimeInput />` |
| `DateRangeInput` | `forms/date-time-inputs.tsx` | `startProps`, `endProps` | `<DateRangeInput />` |
| `OTPInput` | `forms/otp-input.tsx` | `value`, `length`, `numericOnly`, estados | `<OTPInput value={otp} onChange={setOtp} />` |
| `Rating` | `forms/rating.tsx` | `value`, `max`, `size`, `readOnly` | `<Rating value={4} />` |
| `RatingInput` | `forms/rating.tsx` | `value`, `onChange`, `max` | `<RatingInput value={4} onChange={setRating} />` |
| `Carousel` | `data-display/carousel.tsx` | `items`, `loop`, `autoplay`, indicadores | `<Carousel items={slides} />` |

## Ejemplo completo

```tsx
"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardTitle,
  Form,
  Input,
  ThemeToggle,
} from "@/components";

export function Example() {
  const [saved, setSaved] = useState(false);

  return (
    <Card>
      <CardTitle>Nuevo proyecto</CardTitle>
      <CardContent>
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            setSaved(true);
          }}
        >
          <Input label="Nombre" required />
          {saved && <Alert variant="success" title="Guardado" />}
          <Button type="submit">Crear proyecto</Button>
          <ThemeToggle />
        </Form>
      </CardContent>
    </Card>
  );
}
```
