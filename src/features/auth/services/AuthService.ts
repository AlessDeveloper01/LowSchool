import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { compare, hash } from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";

import { sessionUserSchema } from "@/features/auth/schemas/authSchema";
import { AuthRepository } from "@/features/auth/services/AuthRepository";
import type {
  RegisterData,
  RegistrationResult,
  SessionUser,
  SignInData,
} from "@/features/auth/types/auth.types";

const SESSION_COOKIE = "lowpos_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const PASSWORD_SALT_ROUNDS = 12;

function sessionSecret(): Uint8Array {
  const value = process.env.AUTH_SECRET;

  if (!value && process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET must be configured in production");
  }

  return new TextEncoder().encode(
    value ?? "lowpos-development-secret-change-before-production",
  );
}

async function authenticate(input: SignInData): Promise<SessionUser | null> {
  const identifier = input.emailOrUsername.toLowerCase();
  const user = await AuthRepository.findByIdentifier(identifier);

  if (!user || !(await compare(input.password, user.passwordHash))) return null;

  return sessionUserSchema.parse(user);
}

async function register(input: RegisterData): Promise<RegistrationResult> {
  const conflict = await AuthRepository.findConflict(input.username, input.email);

  if (conflict?.username === input.username) {
    return {
      success: false,
      field: "username",
      message: "Ese username ya está registrado.",
    };
  }

  if (conflict?.email === input.email) {
    return {
      success: false,
      field: "email",
      message: "Ese correo electrónico ya está registrado.",
    };
  }

  try {
    const passwordHash = await hash(input.password, PASSWORD_SALT_ROUNDS);
    const user = await AuthRepository.create(input, passwordHash);
    return { success: true, user };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "El username o correo electrónico ya está registrado.",
      };
    }

    throw error;
  }
}

async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(sessionSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, sessionSecret(), {
      algorithms: ["HS256"],
    });
    const parsed = sessionUserSchema.safeParse(payload);
    if (!parsed.success) return null;
    const currentUser = await AuthRepository.findActiveSessionById(parsed.data.id);
    return currentUser ? sessionUserSchema.parse(currentUser) : null;
  } catch {
    return null;
  }
});

export const AuthService = {
  authenticate,
  register,
  createSession,
  deleteSession,
  getSessionUser,
};
