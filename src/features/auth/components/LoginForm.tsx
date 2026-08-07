"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import {
  Form,
  FormFeedback,
  FormInput,
  FormLabel,
  FormSubmit,
} from "@/components/ui/form";
import { signInAction } from "@/features/auth/actions/auth-actions";
import { signInSchema } from "@/features/auth/schemas/authSchema";
import { useAuthStore } from "@/features/auth/store/authStore";

export function LoginForm() {
  const router = useRouter();
  const {
    loginInput,
    loginResult,
    loginPending,
    setLoginInput,
    setLoginResult,
    setLoginPending,
    resetLogin,
  } = useAuthStore();
  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const parsed = signInSchema.safeParse(loginInput);

    if (!parsed.success) {
      setLoginResult({
        success: false,
        message: "Revisa los campos marcados.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    setLoginPending(true);

    try {
      const result = await signInAction(loginInput);
      setLoginResult(result);

      if (result.success && result.data) {
        resetLogin();
        router.replace("/orders");
        router.refresh();
      }
    } catch {
      setLoginResult({
        success: false,
        message: "No fue posible iniciar sesión. Inténtalo nuevamente.",
      });
    } finally {
      setLoginPending(false);
    }
  }

  const identifierError = loginResult.fieldErrors?.emailOrUsername?.[0];
  const passwordError = loginResult.fieldErrors?.password?.[0];

  return (
    <Form variant="plain" className="mt-6" onSubmit={handleSubmit} noValidate>
      {loginResult.message && (
        <FormFeedback
          tone={loginResult.success ? "info" : "error"}
          variant="soft"
        >
          {loginResult.message}
        </FormFeedback>
      )}

      <div className="space-y-2">
        <FormLabel htmlFor="emailOrUsername" className="text-md">
          Usuario o correo
        </FormLabel>
        <FormInput
          id="emailOrUsername"
          name="emailOrUsername"
          type="text"
          placeholder="nombre@empresa.com o username"
          variant="filled"
          autoComplete="username"
          value={loginInput.emailOrUsername}
          onChange={(event) => setLoginInput({ emailOrUsername: event.target.value })}
          status={identifierError ? "error" : "default"}
          disabled={loginPending}
        />
        {identifierError && <FormFeedback tone="error">{identifierError}</FormFeedback>}
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="password" className="text-md">
          Contraseña
        </FormLabel>
        <FormInput
          id="password"
          name="password"
          type="password"
          placeholder="Contraseña"
          variant="filled"
          autoComplete="current-password"
          value={loginInput.password}
          onChange={(event) => setLoginInput({ password: event.target.value })}
          status={passwordError ? "error" : "default"}
          disabled={loginPending}
        />
        {passwordError && <FormFeedback tone="error">{passwordError}</FormFeedback>}
      </div>

      <FormSubmit
        variant="primary"
        fullWidth
        loading={loginPending}
        loadingText="Validando..."
      >
        Iniciar sesión
      </FormSubmit>
    </Form>
  );
}
