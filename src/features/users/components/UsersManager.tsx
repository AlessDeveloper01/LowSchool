"use client";

import { useEffect, useMemo } from "react";
import { LuPencil, LuPlus, LuPower, LuPowerOff, LuSearch, LuShieldCheck, LuUserRound, LuUsers, LuX } from "react-icons/lu";

import { Badge, StatusBadge } from "@/components/data-display/badge";
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from "@/components/data-display/table";
import { TableActions } from "@/components/data-display/table-actions";
import { Input } from "@/components/forms/input";
import { NativeSelect } from "@/components/forms/select";
import { Button } from "@/components/ui/button";
import { FormFeedback } from "@/components/ui/form";
import { UserFormModal } from "@/features/users/components/UserFormModal";
import { UserStatusModal } from "@/features/users/components/UserStatusModal";
import { useUserStore } from "@/features/users/store/userStore";
import type { ManagedUser, UserStatusFilter } from "@/features/users/types/user.types";

const dateFormatter = new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" });
const roleLabels = { SUPER_ADMIN: "Super administrador", MESERO: "Mesero", CLIENTE: "Cliente" } as const;
const statusOptions = [{ value: "all", label: "Todos los estados" }, { value: "active", label: "Activos" }, { value: "inactive", label: "Inactivos" }];
const roleOptions = [{ value: "all", label: "Todos los roles" }, { value: "SUPER_ADMIN", label: "Super administrador" }, { value: "MESERO", label: "Mesero" }, { value: "CLIENTE", label: "Cliente" }];

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function UsersManager({ users, currentUserId }: { users: ManagedUser[]; currentUserId: string }) {
  const search = useUserStore((state) => state.search);
  const roleFilter = useUserStore((state) => state.roleFilter);
  const statusFilter = useUserStore((state) => state.statusFilter);
  const notice = useUserStore((state) => state.notice);
  const openCreate = useUserStore((state) => state.openCreate);
  const openEdit = useUserStore((state) => state.openEdit);
  const openStatus = useUserStore((state) => state.openStatus);
  const setSearch = useUserStore((state) => state.setSearch);
  const setRoleFilter = useUserStore((state) => state.setRoleFilter);
  const setStatusFilter = useUserStore((state) => state.setStatusFilter);
  const dismissNotice = useUserStore((state) => state.dismissNotice);
  const reset = useUserStore((state) => state.reset);
  useEffect(() => () => reset(), [reset]);

  const filtered = useMemo(() => {
    const term = normalize(search.trim());
    return users.filter((user) => {
      const matchesTerm = !term || [user.name, user.username, user.email].some((value) => normalize(value).includes(term));
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? user.isActive : !user.isActive);
      return matchesTerm && matchesRole && matchesStatus;
    });
  }, [roleFilter, search, statusFilter, users]);

  return (
    <>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-secondary">Administración</p><h1 className="mt-2 text-3xl font-black text-foreground">Usuarios</h1><p className="mt-2 text-sm text-muted">Administra accesos, roles y credenciales del sistema.</p></div>
          <Button leftIcon={<LuPlus />} onClick={openCreate}>Nuevo usuario</Button>
        </header>
        {notice && <div className="flex items-start gap-3 rounded-xl bg-success/10 p-3 text-success"><FormFeedback tone="success" className="min-w-0 flex-1">{notice.message}</FormFeedback><button type="button" aria-label="Cerrar mensaje" className="grid size-8 place-items-center rounded-lg hover:bg-success/10" onClick={dismissNotice}><LuX /></button></div>}
        <section className="grid gap-3 sm:grid-cols-3">
          <Summary label="Total" value={users.length} icon={<LuUsers />} />
          <Summary label="Activos" value={users.filter(({ isActive }) => isActive).length} icon={<LuUserRound />} tone="success" />
          <Summary label="Administradores" value={users.filter(({ role, isActive }) => role === "SUPER_ADMIN" && isActive).length} icon={<LuShieldCheck />} tone="secondary" />
        </section>
        <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-foreground/5 sm:p-5">
          <div className="mb-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_200px]">
            <Input aria-label="Buscar usuarios" value={search} leftIcon={<LuSearch />} placeholder="Buscar por nombre, username o correo..." onChange={(event) => setSearch(event.target.value)} />
            <NativeSelect aria-label="Filtrar por rol" value={roleFilter} options={roleOptions} onChange={(event) => setRoleFilter(event.target.value as typeof roleFilter)} />
            <NativeSelect aria-label="Filtrar por estado" value={statusFilter} options={statusOptions} onChange={(event) => setStatusFilter(event.target.value as UserStatusFilter)} />
          </div>
          <Table variant="hoverable">
            <TableHeader><TableRow><TableHead>Usuario</TableHead><TableHead>Username</TableHead><TableHead>Rol</TableHead><TableHead>Estado</TableHead><TableHead>Actualización</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.length === 0 ? <TableEmpty colSpan={6} message={users.length === 0 ? "Todavía no hay usuarios." : "No hay usuarios que coincidan con los filtros."} /> : filtered.map((user) => (
                <TableRow key={user.id} className={!user.isActive ? "opacity-65" : undefined}>
                  <TableCell><div className="flex items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 font-black text-primary">{user.name.charAt(0).toUpperCase()}</span><div className="min-w-0"><p className="font-extrabold text-foreground">{user.name} {user.id === currentUserId && <Badge variant="soft" className="ml-1">Tú</Badge>}</p><p className="truncate text-xs text-muted">{user.email}</p></div></div></TableCell>
                  <TableCell className="font-bold">@{user.username}</TableCell>
                  <TableCell><Badge variant={user.role === "SUPER_ADMIN" ? "soft" : "outline"}>{roleLabels[user.role]}</Badge></TableCell>
                  <TableCell><StatusBadge status={user.isActive ? "active" : "inactive"} /></TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted">{dateFormatter.format(new Date(user.updatedAt))}</TableCell>
                  <TableCell><TableActions variant="dropdown" actions={[
                    { id: "edit", label: "Editar", icon: <LuPencil />, onSelect: () => openEdit(user) },
                    user.isActive
                      ? { id: "deactivate", label: "Desactivar", icon: <LuPowerOff />, destructive: true, disabled: user.id === currentUserId, onSelect: () => openStatus(user, false) }
                      : { id: "activate", label: "Activar", icon: <LuPower />, onSelect: () => openStatus(user, true) },
                  ]} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-4 text-xs text-muted">Mostrando {filtered.length} de {users.length} usuarios.</p>
        </section>
      </div>
      <UserFormModal currentUserId={currentUserId} />
      <UserStatusModal />
    </>
  );
}

function Summary({ label, value, icon, tone = "primary" }: { label: string; value: number; icon: React.ReactNode; tone?: "primary" | "success" | "secondary" }) {
  const style = tone === "success" ? "bg-success/10 text-success" : tone === "secondary" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary";
  return <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4"><span className={`grid size-10 place-items-center rounded-xl ${style}`}>{icon}</span><div><p className="text-xs font-bold text-muted">{label}</p><p className="text-2xl font-black text-foreground">{value}</p></div></div>;
}

