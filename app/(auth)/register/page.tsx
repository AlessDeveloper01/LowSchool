import Link from "next/link";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { AuthService } from "@/features/auth/services/AuthService";
import { generateMetadata } from "@/utils/metadata";

export const metadata = generateMetadata({
  title: "Crear cuenta",
});

export default async function RegisterPage() {
  const user = await AuthService.getSessionUser();

  if (user) redirect("/orders");

  return (
    <main className="grid min-h-screen place-items-center bg-background p-6 text-foreground">
      <section className="w-full max-w-2xl rounded-2xl border border-border bg-surface px-7 py-6">
        <p className="mb-6 text-center text-2xl font-black text-secondary">
          LowPos
        </p>
        <h1 className="text-2xl font-black uppercase tracking-tight">
          Crear cuenta
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Registra tus datos para acceder al sistema como cliente.
        </p>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-muted">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="font-extrabold text-primary hover:text-primary-hover"
          >
            Inicia sesión
          </Link>
        </p>
      </section>
    </main>
  );
}
