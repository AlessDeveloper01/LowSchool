"use client";

import type { FormEvent } from "react";

import { PasswordInput, PasswordStrengthInput } from "@/components/forms";
import {
  Form,
  FormFeedback,
  FormInput,
  FormLabel,
  FormSubmit,
} from "@/components/ui/form";
import { registerAction } from "@/features/auth/actions/auth-actions";
import { registerSchema } from "@/features/auth/schemas/authSchema";
import { useAuthStore } from "@/features/auth/store/authStore";

export function RegisterForm() {
  const {
    registerInput,
    registerResult,
    registerPending,
    setRegisterInput,
    setRegisterResult,
    setRegisterPending,
  } = useAuthStore();
  const errors = registerResult.fieldErrors;

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const parsed = registerSchema.safeParse(registerInput);

    if (!parsed.success) {
      setRegisterResult({
        success: false,
        message: "Revisa los campos marcados.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    setRegisterPending(true);
    try {
      setRegisterResult(await registerAction(registerInput));
    } finally {
      setRegisterPending(false);
    }
  }

  return (
    <Form variant="plain" className="mt-6" onSubmit={handleSubmit} noValidate>
      {registerResult.message && (
        <FormFeedback tone="error" variant="soft">
          {registerResult.message}
        </FormFeedback>
      )}

      <div className="space-y-2">
        <FormLabel htmlFor="name" className="text-md" required>
          Nombre completo
        </FormLabel>
        <FormInput
          id="name"
          name="name"
          type="text"
          variant="filled"
          placeholder="Tu nombre completo"
          autoComplete="name"
          value={registerInput.name}
          onChange={(event) => setRegisterInput({ name: event.target.value })}
          status={errors?.name ? "error" : "default"}
          disabled={registerPending}
        />
        {errors?.name?.[0] && (
          <FormFeedback tone="error">{errors.name[0]}</FormFeedback>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <FormLabel htmlFor="username" className="text-md" required>
            Username
          </FormLabel>
          <FormInput
            id="username"
            name="username"
            type="text"
            variant="filled"
            placeholder="nombre.usuario"
            autoComplete="username"
            autoCapitalize="none"
            value={registerInput.username}
            onChange={(event) => setRegisterInput({ username: event.target.value })}
            status={errors?.username ? "error" : "default"}
            disabled={registerPending}
          />
          {errors?.username?.[0] && (
            <FormFeedback tone="error">{errors.username[0]}</FormFeedback>
          )}
        </div>

        <div className="space-y-2">
          <FormLabel htmlFor="email" className="text-md" required>
            Correo electrónico
          </FormLabel>
          <FormInput
            id="email"
            name="email"
            type="email"
            variant="filled"
            placeholder="nombre@empresa.com"
            autoComplete="email"
            autoCapitalize="none"
            value={registerInput.email}
            onChange={(event) => setRegisterInput({ email: event.target.value })}
            status={errors?.email ? "error" : "default"}
            disabled={registerPending}
          />
          {errors?.email?.[0] && (
            <FormFeedback tone="error">{errors.email[0]}</FormFeedback>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="password" className="text-md" required>
          Contraseña
        </FormLabel>
        <PasswordStrengthInput
          id="password"
          name="password"
          variant="filled"
          placeholder="Crea una contraseña segura"
          autoComplete="new-password"
          value={registerInput.password}
          onValueChange={(password) => setRegisterInput({ password })}
          showRules
          error={errors?.password?.[0]}
          disabled={registerPending}
        />
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="confirmPassword" className="text-md" required>
          Confirmar contraseña
        </FormLabel>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          variant="filled"
          placeholder="Repite tu contraseña"
          autoComplete="new-password"
          value={registerInput.confirmPassword}
          onChange={(event) =>
            setRegisterInput({ confirmPassword: event.target.value })
          }
          error={errors?.confirmPassword?.[0]}
          disabled={registerPending}
        />
      </div>

      <FormSubmit
        variant="primary"
        fullWidth
        loading={registerPending}
        loadingText="Creando cuenta..."
      >
        Crear cuenta
      </FormSubmit>
    </Form>
  );
}
