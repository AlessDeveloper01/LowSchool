import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { AuthService } from "@/features/auth/services/AuthService";
import { generateMetadata } from "@/utils/metadata";

export const metadata = generateMetadata({
  title: "Iniciar sesión",
})

export default async function LoginPage() {
  const user = await AuthService.getSessionUser();

  if (user) redirect("/orders");

  return (
    <main className="grid min-h-screen place-items-center bg-background p-6 text-foreground">
      <section className="w-full max-w-lg rounded-2xl border border-border bg-surface px-7 py-6">
        <p className="mb-6 text-center text-2xl font-black text-secondary">
          LowSchool
        </p>
        <h1 className="text-2xl font-black uppercase tracking-tight">
          Iniciar sesión
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Ingresa tu correo o username y contraseña para acceder al sistema.
        </p>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-muted">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/register"
            className="font-extrabold text-primary hover:text-primary-hover"
          >
            Regístrate
          </Link>
        </p>
      </section>
    </main>
  );
}
