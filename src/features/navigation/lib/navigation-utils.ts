import type {
  NavNode,
  NavRootItem,
  SearchableNavItem,
} from "@/features/navigation/types/navigation";

export function getNavChildren(item: NavNode): NavNode[] {
  if (!("children" in item) || !item.children) {
    return [];
  }

  return item.children;
}

export function isPathActive(href: string | undefined, pathname: string): boolean {
  if (!href) {
    return false;
  }

  return normalizePath(href) === normalizePath(pathname);
}

export function branchContainsPath(
  item: NavNode,
  pathname: string,
): boolean {
  if (item.type === "link" && isPathActive(item.href, pathname)) {
    return true;
  }

  return getNavChildren(item).some((child) =>
    branchContainsPath(child, pathname),
  );
}

export function getActiveAncestorIds(
  items: NavRootItem[],
  pathname: string,
): string[] {
  for (const item of items) {
    const activeBranch = findActiveBranch(item, pathname);

    if (activeBranch.length > 0) {
      return activeBranch.slice(0, -1);
    }
  }

  return [];
}

export function getPageTitle(
  items: NavRootItem[],
  pathname: string,
): string {
  const activeItem = findItemByPath(items, pathname);
  return activeItem?.label ?? "Dashboard";
}

export function flattenNavigation(
  items: NavRootItem[],
): SearchableNavItem[] {
  return items.flatMap((item) => flattenItem(item, []));
}

export function filterSearchableItems(
  items: SearchableNavItem[],
  query: string,
): SearchableNavItem[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) =>
    item.label.toLocaleLowerCase().includes(normalizedQuery),
  );
}

function normalizePath(path: string): string {
  if (path === "/") {
    return path;
  }

  return path.replace(/\/+$/, "");
}

function findActiveBranch(item: NavNode, pathname: string): string[] {
  if (isPathActive(item.href, pathname)) {
    return [item.id];
  }

  for (const child of getNavChildren(item)) {
    const childBranch = findActiveBranch(child, pathname);

    if (childBranch.length > 0) {
      return [item.id, ...childBranch];
    }
  }

  return [];
}

function findItemByPath(
  items: NavNode[],
  pathname: string,
): NavNode | undefined {
  for (const item of items) {
    if (isPathActive(item.href, pathname) && item.type === "link") {
      return item;
    }

    const match = findItemByPath(getNavChildren(item), pathname);

    if (match) {
      return match;
    }
  }

  return undefined;
}

function flattenItem(
  item: NavNode,
  parents: string[],
): SearchableNavItem[] {
  const hierarchy = [...parents, item.label];
  const current =
    item.type === "link" && item.href
      ? [
          {
            id: item.id,
            label: item.label,
            href: item.href,
            breadcrumb: hierarchy.join(" / "),
            icon: item.icon,
          },
        ]
      : [];

  return [
    ...current,
    ...getNavChildren(item).flatMap((child) =>
      flattenItem(child, hierarchy),
    ),
  ];
}
