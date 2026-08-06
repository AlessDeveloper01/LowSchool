"use client";

import { create } from "zustand";

import type {
  AuthActionResult,
  RegisterInput,
  SignInActionResult,
  SignInInput,
} from "@/features/auth/types/auth.types";

const emptyLogin: SignInInput = { emailOrUsername: "", password: "" };
const emptyRegister: RegisterInput = {
  name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

interface AuthStore {
  loginInput: SignInInput;
  loginResult: SignInActionResult;
  loginPending: boolean;
  registerInput: RegisterInput;
  registerResult: AuthActionResult<RegisterInput>;
  registerPending: boolean;
  setLoginInput: (input: Partial<SignInInput>) => void;
  setLoginResult: (result: SignInActionResult) => void;
  setLoginPending: (pending: boolean) => void;
  resetLogin: () => void;
  setRegisterInput: (input: Partial<RegisterInput>) => void;
  setRegisterResult: (result: AuthActionResult<RegisterInput>) => void;
  setRegisterPending: (pending: boolean) => void;
  resetRegister: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  loginInput: emptyLogin,
  loginResult: { success: true },
  loginPending: false,
  registerInput: emptyRegister,
  registerResult: { success: true },
  registerPending: false,

  setLoginInput: (input) =>
    set((state) => ({ loginInput: { ...state.loginInput, ...input } })),
  setLoginResult: (loginResult) => set({ loginResult }),
  setLoginPending: (loginPending) => set({ loginPending }),
  resetLogin: () =>
    set({ loginInput: emptyLogin, loginResult: { success: true }, loginPending: false }),

  setRegisterInput: (input) =>
    set((state) => ({ registerInput: { ...state.registerInput, ...input } })),
  setRegisterResult: (registerResult) => set({ registerResult }),
  setRegisterPending: (registerPending) => set({ registerPending }),
  resetRegister: () =>
    set({
      registerInput: emptyRegister,
      registerResult: { success: true },
      registerPending: false,
    }),
}));
