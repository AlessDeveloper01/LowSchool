import {
  LuBookOpen,
  LuClipboardCheck,
  LuFileArchive,
  LuGauge,
  LuGraduationCap,
  LuLayers3,
  LuPalette,
  LuSettings2,
  LuUser,
  LuUserCog,
  LuUserPlus,
  LuUsers,
} from "react-icons/lu";

import type { NavRootItem } from "@/features/navigation/types/navigation";
import { MdFileCopy } from "react-icons/md";

export const navigationConfig: NavRootItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LuGauge,
    type: "link",
    href: "/dashboard",
  },
  {
    id: "students",
    label: "Estudiantes",
    icon: LuGraduationCap,
    type: "group",
    children: [
      {
        id: "students-list",
        label: "Lista de alumnos",
        icon: LuUsers,
        type: "link",
        href: "/students",
      },
    ],
  },
  {
    id: "academics",
    label: "Grupos y materias",
    icon: LuLayers3,
    type: "group",
    children: [
      {
        id: "school-years",
        label: "Ciclos escolares",
        icon: LuLayers3,
        type: "link",
        href: "/school-years",
      },
      {
        id: "groups",
        label: "Grupos",
        icon: LuLayers3,
        type: "link",
        href: "/groups",
      },
      {
        id: "subjects",
        label: "Materias",
        icon: LuBookOpen,
        type: "link",
        href: "/subjects",
      },
    ],
  },
  {
    id: "attendance",
    label: "Asistencia",
    icon: LuClipboardCheck,
    type: "link",
    href: "/attendance",
  },
  {
    id: "grades",
    label: "Calificaciones",
    icon: MdFileCopy,
    type: "link",
    href: "/grades",
  },
  {
    id: "reports",
    label: "Reportes",
    icon: LuFileArchive,
    type: "link",
    href: "/reports",
  },
  {
    id: "users",
    label: "Usuarios",
    icon: LuUserCog,
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
      },
    ],
  },
];