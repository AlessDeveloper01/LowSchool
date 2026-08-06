import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthService } from "@/features/auth/services/AuthService";
import { UsersManager } from "@/features/users/components/UsersManager";
import { UserService } from "@/features/users/services/UserService";

export const metadata: Metadata = { title: "Usuarios" };
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const currentUser = await AuthService.getSessionUser();
  if (!currentUser || currentUser.role !== "SUPER_ADMIN") redirect("/orders");
  const users = await UserService.listUsers();
  return <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8"><UsersManager users={users} currentUserId={currentUser.id} /></div>;
}

