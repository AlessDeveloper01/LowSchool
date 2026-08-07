import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthService } from "@/features/auth/services/AuthService";
import { GroupsManager } from "@/features/groups/components/GroupsManager";
import { listGroupOptions, listGroups } from "@/features/groups/groups";

export const metadata: Metadata = { title: "Grupos" };
export const dynamic = "force-dynamic";

export default async function GroupsPage() {
  const currentUser = await AuthService.getSessionUser();
  if (!currentUser || (currentUser.role !== "SUPER_ADMIN" && currentUser.role !== "ADMIN")) redirect("/dashboard");

  const [groups, options] = await Promise.all([listGroups(), listGroupOptions()]);
  return <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8"><GroupsManager groups={groups} options={options} /></div>;
}