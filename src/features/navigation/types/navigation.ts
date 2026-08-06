import type { IconType } from "react-icons";

export type NavItemType = "link" | "group";

export interface NavLeafItem {
  id: string;
  label: string;
  icon?: IconType;
  type: "link";
  href: string;
}

export interface NavLevel2Item {
  id: string;
  label: string;
  icon?: IconType;
  type: NavItemType;
  href?: string;
  children?: NavLeafItem[];
}

export interface NavLevel1Item {
  id: string;
  label: string;
  icon?: IconType;
  type: NavItemType;
  href?: string;
  children?: NavLevel2Item[];
}

export interface NavRootItem {
  id: string;
  label: string;
  icon?: IconType;
  type: NavItemType;
  href?: string;
  badge?: string | number;
  children?: NavLevel1Item[];
}

export type NavNode =
  | NavRootItem
  | NavLevel1Item
  | NavLevel2Item
  | NavLeafItem;

export interface SearchableNavItem {
  id: string;
  label: string;
  href: string;
  breadcrumb: string;
  icon?: IconType;
}
