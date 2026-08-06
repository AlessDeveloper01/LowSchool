import "server-only";

import { getPrisma } from "@/lib/prisma";

interface ProfileUpdateRecord {
  name?: string;
  email?: string;
  passwordHash?: string;
}

async function findUniqueEmail(email: string) {
  return getPrisma().user.findUnique({
    where: { email },
    select: { id: true },
  });
}

async function update(data: ProfileUpdateRecord, id: string) {
  return getPrisma().user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
    },
  });
}

export const ProfileRepository = {
  findUniqueEmail,
  update,
};
