"use client";

import { useEffect } from "react";

import { EditableAvatar, PageLoader } from "@/components";
import FormProfile from "@/features/profile/components/FormProfile";
import { useProfileStore } from "@/features/profile/store/profile.store";
import { getRoleName } from "@/features/profile/types/roles.types";

const ProfileView = () => {
  const profile = useProfileStore((state) => state.profile);
  const isLoading = useProfileStore((state) => state.isLoading);
  const isUpdatingProfile = useProfileStore((state) => state.isUpdatingProfile);
  const profileUpdateProgress = useProfileStore(
    (state) => state.profileUpdateProgress,
  );
  const getProfile = useProfileStore((state) => state.getProfile);

  useEffect(() => {
    void getProfile();
  }, [getProfile]);

  if (isLoading && !profile) {
    return (
      <PageLoader
        label="Cargando perfil..."
        description="Estamos recuperando la información de tu cuenta."
        variant="spinner"
        layout="section"
      />
    );
  }

  if (!profile) {
    return <div className="p-4">No hay perfil disponible</div>;
  }

  return (
    <>
      {isUpdatingProfile && (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm">
          <PageLoader
            label={
              profileUpdateProgress < 55
                ? "Guardando cambios..."
                : profileUpdateProgress < 100
                  ? "Actualizando tu sesión..."
                  : "Perfil actualizado"
            }
            description="Espera un momento mientras refrescamos tu información en toda la aplicación."
            value={profileUpdateProgress}
            variant="steps"
            tone="primary"
            layout="screen"
          />
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full rounded-lg bg-background p-4 shadow-sm md:w-1/3">
          <h2 className="mb-5 text-lg font-bold">Información del Perfil</h2>
          <div className="flex flex-col gap-3">
            <div className="mx-auto">
              <EditableAvatar
                alt={profile.username}
                name={profile.name}
                size="2xl"
                onEdit={() => undefined}
              />
            </div>
            <p className="font-semibold">
              Nombre: <span className="font-black text-primary">{profile.name}</span>
            </p>
            <p className="font-semibold">
              Email: <span className="font-black text-primary">{profile.email}</span>
            </p>
            <p className="font-semibold">
              Rol:{" "}
              <span className="font-black text-primary">
                {getRoleName(profile.role)}
              </span>
            </p>
            <p className="font-semibold">
              Usuario:{" "}
              <span className="font-black text-primary">{profile.username}</span>
            </p>
          </div>
        </div>

        <div className="w-full rounded-lg bg-background p-4 shadow-md md:w-2/3">
          <FormProfile />
        </div>
      </div>
    </>
  );
};

export default ProfileView;
