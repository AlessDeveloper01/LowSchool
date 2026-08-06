import ProfileView from "@/features/profile/components/ProfileView";
import { generateMetadata } from "@/utils/metadata";

export const dynamic = "force-dynamic";

export const metadata = generateMetadata({
  title: "Perfil",
  description: "Gestiona tu perfil de usuario",
});

const ProfilePage = async () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-secondary">
          Configura tu perfil
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground">
          Perfil de usuario
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          Aquí puedes actualizar tu información personal, cambiar tu contraseña
          y gestionar tus preferencias de notificación.
        </p>
      </div>
      <ProfileView />
    </div>
  );
};

export default ProfilePage;
