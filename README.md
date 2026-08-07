# LowPOS — base monolítica con Next.js

Base monolítica con Next.js App Router, React, Server Components, Server
Actions, Route Handlers, Prisma, Zod y Tailwind CSS. No depende de un backend
HTTP externo.

## Inicio rápido

```bash
pnpm install
copy .env.example .env
pnpm dev
```

Abre `http://localhost:3000/register` para crear el primer usuario. Las cuentas
se guardan en PostgreSQL y las contraseñas se almacenan con bcrypt. Antes de
desplegar, define un `AUTH_SECRET` aleatorio de al menos 32 caracteres.

## Límites servidor/cliente

El proyecto sigue una regla sencilla: todo comienza en el servidor y sólo se
marca como Client Component la isla que necesita estado, efectos o APIs del
navegador.

```text
app/**/page.tsx                 Server Component: lectura y composición
app/**/layout.tsx               Server Component: sesión y protección
src/features/*/actions/*.ts     Server Actions: mutaciones y redirecciones
src/features/*/services/*.ts    Casos de uso y repositorios del servidor
src/features/*/schemas/*.ts     Contratos Zod compartidos
src/features/*/components/*.tsx Server por defecto
.../interactive-component.tsx  Client sólo cuando necesita interacción
app/api/**/route.ts             HTTP público o integraciones externas
```

### Flujo implementado de referencia

1. `LoginForm.tsx` construye un objeto tipado y controla el estado pendiente.
2. `signInAction` recibe ese DTO completo, lo valida con Zod en el servidor y
   entrega exclusivamente datos validados al servicio.
3. `AuthService.ts` contiene las reglas, bcrypt y la sesión JWT.
4. `AuthRepository.ts` es la única capa de auth que accede a Prisma.
5. El layout del dashboard valida la sesión antes de renderizar. El logout es
   también una Server Action.

## Patrón para una nueva funcionalidad

Para un módulo como `products`, conserva juntas sus piezas:

```text
src/features/products/
├── actions/product-actions.ts       # "use server"; DTOs y mutaciones
├── components/ProductForm.tsx       # cliente sólo si es necesario
├── schemas/productSchema.ts         # validación Zod
├── services/ProductRepository.ts    # acceso Prisma
├── services/ProductService.ts       # reglas del negocio
└── types/product.types.ts           # tipos derivados de schemas
```

Una Server Action debe validar de nuevo toda entrada, comprobar autorización,
ejecutar el caso de uso y finalmente invalidar datos con `revalidatePath` o
`revalidateTag`. No se deben importar Prisma ni secretos desde un Client
Component.

La UI interna no llama a `/api` mediante `fetch`: Server Components y Server
Actions invocan directamente los servicios y `getPrisma()`. Los Route Handlers
en `app/api` se reservan para clientes externos, webhooks, descargas u otros
casos donde sí existe una frontera HTTP. Cada handler devuelve su respuesta con
`Response.json`; no hay un tipo de respuesta global obligatorio.

## Variables de entorno

Consulta `.env.example`:

- `DATABASE_URL`: conexión PostgreSQL para Prisma.
- `AUTH_SECRET`: firma de la cookie de sesión.
- `CLOUDINARY_CLOUD_NAME`: nombre del entorno de Cloudinary.
- `CLOUDINARY_API_KEY`: clave de API de Cloudinary, disponible sólo en servidor.
- `CLOUDINARY_API_SECRET`: secreto de Cloudinary, disponible sólo en servidor.

## Personalización global

El usuario `SUPER_ADMIN` puede abrir `/settings/customization` y configurar los
colores primario, secundario y terciario, el color general del texto, elegir
packs de colores recomendados, la moneda, una de las tipografías disponibles y el logo global. La Server Action
recibe un objeto tipado, valida nuevamente con Zod y guarda el singleton
`app_customization` en PostgreSQL; no utiliza `FormData`.

El color del texto se respeta directamente en el tema claro. Para el modo oscuro
se calcula una variante del mismo tono con contraste WCAG mínimo de 4.5:1, de
modo que el contenido siga siendo legible aunque se seleccione un color oscuro.

El nombre y subtítulo del producto son editables y se reflejan en el sidebar y
en la identidad preparada para tickets. También se pueden configurar logos
independientes para modo claro y oscuro; si falta una variante, la disponible
se usa como respaldo.

Cada logo admite PNG, JPG o WebP con un máximo de 2 MB. Se envía como parte del
objeto validado a la Server Action y ésta realiza una carga firmada a Cloudinary,
por lo que las credenciales nunca llegan al navegador. PostgreSQL conserva sólo
la URL segura y el identificador requerido para reemplazar o eliminar el recurso.
El componente `BrandLogo` selecciona automáticamente la variante adecuada en el
sidebar e incluye `placement="ticket"` para conectarlo a la impresión real cuando
exista ese módulo.

`GET /api/customization` publica únicamente estos valores visuales, siempre con
`Cache-Control: no-store`. El proveedor global los consulta al iniciar, cuando
regresa la conexión, al volver a enfocar la pestaña y cada 60 segundos mientras
la aplicación está visible. Así otros dispositivos reciben los cambios sin
guardar configuración persistente en Zustand.

La última configuración no sensible se conserva en `localStorage` para evitar
un cambio visual durante la hidratación y para mantener la identidad del sistema
en las pantallas offline. PostgreSQL continúa siendo la fuente de verdad. Para
mostrar importes nuevos utiliza `CurrencyAmount` o `formatCurrency`, evitando
símbolos de moneda hardcodeados.

## Categorías de productos

La ruta `/products/categories` lista categorías reales desde PostgreSQL y
permite buscar y filtrar por estado. Todos los usuarios autenticados pueden
consultarlas, pero únicamente `SUPER_ADMIN` puede crear, editar, desactivar y
restaurar desde los modales.

Las mutaciones utilizan Server Actions con objetos tipados y validación Zod; no
usan `FormData`. La eliminación es lógica: conserva la fila, marca `activo=false`
y registra `deletedAt`. Restaurar revierte ambos valores. Los nombres se validan
sin distinguir mayúsculas y minúsculas para evitar duplicados como `Bebidas` y
`bebidas`.

## Variantes y extras

La ruta `/products/extras` administra dos catálogos mediante tabs. Cada grupo se
muestra como una card desplegable con opciones activas e inactivas. Un
`SUPER_ADMIN` puede crear y editar grupos, agregar y editar opciones, aplicar
soft delete, restaurar y seleccionar una única opción predeterminada por grupo.

Las variantes representan una selección exclusiva. Los extras permiten
configurar obligatoriedad, mínimo y máximo. Las opciones guardan precio
adicional; las variantes también admiten SKU. PostgreSQL impide por restricción
que existan dos opciones activas predeterminadas en el mismo grupo. Todas las
mutaciones usan objetos tipados, Zod y Server Actions sin `FormData`.

## Productos

La ruta `/products` contiene el catálogo real respaldado por PostgreSQL. Permite
buscar y filtrar por estado o categoría, crear y editar productos, asignar una
categoría, configurar SKU y precio base, elegir cómo se calcula el precio y
relacionar grupos reutilizables de variantes y extras.

Las imágenes PNG, JPG o WebP de hasta 2 MB se cargan de forma firmada a
Cloudinary. En PostgreSQL sólo se guardan la URL segura y el identificador del
recurso. Al reemplazar o quitar una imagen se limpia el recurso anterior sin
exponer credenciales al navegador.

La desactivación es lógica mediante `activo` y `deletedAt`, por lo que conserva
relaciones e imagen y puede revertirse. Sólo `SUPER_ADMIN` puede realizar
mutaciones. Todas las Server Actions reciben objetos completos, vuelven a
validarlos con Zod y no utilizan `FormData`.

## Pedidos y tickets

La ruta `/orders` funciona como punto de venta: muestra como máximo cinco
productos y ordena la búsqueda por cercanía del nombre. En móvil usa un grid de
dos columnas y un botón flotante abre la nota actual. Los productos con modificadores
abren un stepper ordenado por grupos; cada renglón permite cantidad, variantes,
extras y una nota editable. La nota también admite indicaciones globales,
descuento fijo o porcentual e IVA opcional del 16%.

El servicio predeterminado es `CONSUMIR` y requiere seleccionar una de las 15
mesas de Terraza o 20 mesas de Interior. Si se intenta finalizar sin mesa, la
selección pendiente abre el modal y crea el pedido al elegirla. También puede elegirse `PARA LLEVAR`,
que no conserva mesa. PostgreSQL recalcula y guarda todos los importes; el
navegador no es fuente de verdad para precios, descuentos ni impuestos.

Cada pedido conserva snapshots de nombres, precios y del mesero creador para que
los tickets históricos no cambien cuando se edite el catálogo, el usuario o cuando
otra persona los reimprima. Al finalizar se ofrecen dos formatos independientes
de 80 mm: comanda de cocina sin importes y ticket de cliente con subtotal,
descuento, IVA y total. Cada formato mantiene impresión web y salida binaria
ESC/POS para RawBT con avance de papel y comando de autocorte. `/orders/list` permite reimprimir,
marcar como completado o cancelar conservando el historial.

## Comandos

```bash
pnpm dev      # genera Prisma Client y abre el entorno de desarrollo
pnpm lint     # reglas de Next.js y TypeScript
pnpm build    # build de producción y comprobación de tipos
pnpm start    # servir el build
pnpm db:generate # generar Prisma Client
pnpm db:migrate  # crear/aplicar migraciones en desarrollo
pnpm db:deploy   # aplicar migraciones pendientes en producción
pnpm db:seed     # cargar el catálogo inicial después de migrar
pnpm db:studio   # abrir Prisma Studio
```
