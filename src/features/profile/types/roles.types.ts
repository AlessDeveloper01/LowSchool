export const ROLES_DICTIONARY: Record<string, string> = {
  SUPER_ADMIN: "Super Administrador",
  ADMIN: "Administrador",
  ADMINISTRATIVO: "Administrativo",
  CLIENTE: "Cliente"
}

export const getRoleName = (role: string): string => {
  return ROLES_DICTIONARY[role] || "Rol desconocido";
}