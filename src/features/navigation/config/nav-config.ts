import {
  LuFileChartColumn,
  LuGauge,
  LuLayers3,
  LuListPlus,
  LuPackage,
  LuPalette,
  LuSettings2,
  LuShoppingCart,
  LuTags,
  LuUser,
  LuUsers,
} from "react-icons/lu";

import type { NavRootItem } from "@/features/navigation/types/navigation";

export const navigationConfig: NavRootItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LuGauge,
    type: "link",
    href: "/dashboard",
  },
  {
    id: "sales",
    label: "Ventas",
    icon: LuShoppingCart,
    type: "group",
    children: [
      {
        id: "orders",
        label: "Crear pedido",
        icon: LuShoppingCart,
        type: "link",
        href: "/orders",
      },
      {
        id: "list-orders",
        label: "Lista de pedidos",
        icon: LuFileChartColumn,
        type: "link",
        href: "/orders/list",
      },
    ],
  },
  {
    id: "box",
    label: "Caja",
    icon: LuFileChartColumn,
    type: "link",
    href: "/box",
  },
  {
    id: "products",
    label: "Productos",
    icon: LuLayers3,
    type: "group",
    badge: "Nuevo",
    children: [
      {
        id: "products-list",
        label: "Lista de productos",
        icon: LuPackage,
        type: "link",
        href: "/products",
      },
      {
        id: "products-categories",
        label: "Categorías",
        icon: LuTags,
        type: "link",
        href: "/products/categories",
      },
      {
        id: "products-extras",
        label: "Extras y modificadores",
        icon: LuListPlus,
        type: "link",
        href: "/products/extras",
      },
    ],
  },
  {
    id: "users",
    label: "Usuarios",
    icon: LuUsers,
    type: "link",
    href: "/users",
  },
  {
    id: "settings",
    label: "Configuración",
    icon: LuSettings2,
    type: "group",
    children: [
      {
        id: "customization",
        label: "Personalización",
        icon: LuPalette,
        type: "link",
        href: "/settings/customization",
      },
      {
        id: "my-account",
        label: "Mi cuenta",
        icon: LuUser,
        type: "link",
        href: "/settings/profile",
      }
    ],
  },
];
