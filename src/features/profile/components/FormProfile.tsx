"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Alert,
  Form,
  FormFeedback,
  FormInput,
  FormLabel,
  FormSubmit,
} from "@/components";
import { updateProfileAction } from "@/features/profile/actions/update-profile.action";
import {
  updateProfileSchema,
  type UpdateProfileData,
} from "@/features/profile/schemas/update-profile.schema";
import { useProfileStore } from "@/features/profile/store/profile.store";

let feedbackTimer: ReturnType<typeof setTimeout> | null = null;

const FormProfile = () => {
  const router = useRouter();
  const profile = useProfileStore((state) => state.profile);
  const errorUpdate = useProfileStore((state) => state.errorUpdate);
  const isUpdatingProfile = useProfileStore((state) => state.isUpdatingProfile);
  const setErrorUpdate = useProfileStore((state) => state.setErrorUpdate);
  const getProfile = useProfileStore((state) => state.getProfile);
  const startProfileUpdate = useProfileStore((state) => state.startProfileUpdate);
  const setProfileUpdateProgress = useProfileStore(
    (state) => state.setProfileUpdateProgress,
  );
  const finishProfileUpdate = useProfileStore(
    (state) => state.finishProfileUpdate,
  );

  const { formState, register, handleSubmit, getValues } =
    useForm<UpdateProfileData>({
      resolver: zodResolver(updateProfileSchema),
      mode: "all",
      defaultValues: {
        name: profile?.name ?? "",
        email: profile?.email ?? "",
        password: "",
        "confirm-password": "",
      },
    });

  const onSubmit = async () => {
    if (!profile || isUpdatingProfile) return;

    const data: UpdateProfileData = {
      name: formState.dirtyFields.name ? getValues("name") : profile.name,
      email: formState.dirtyFields.email ? getValues("email") : profile.email,
      password: formState.dirtyFields.password
        ? getValues("password")
        : undefined,
      "confirm-password": formState.dirtyFields.password
        ? getValues("confirm-password")
        : undefined,
    };

    if (feedbackTimer) clearTimeout(feedbackTimer);
    setErrorUpdate(null);
    startProfileUpdate();
    const progressTimer = setInterval(() => {
      const current = useProfileStore.getState().profileUpdateProgress;
      const increment = current < 45 ? 6 : current < 75 ? 3 : 1;
      setProfileUpdateProgress(Math.min(88, current + increment));
    }, 180);

    const moveProgressTo = (value: number) => {
      const current = useProfileStore.getState().profileUpdateProgress;
      setProfileUpdateProgress(Math.max(current, value));
    };

    try {
      const updated = await updateProfileAction(data);
      if (!updated) {
        setErrorUpdate(true);
        return;
      }

      moveProgressTo(62);
      const refreshed = await getProfile(true);
      if (!refreshed) {
        throw new Error("No fue posible refrescar el perfil actualizado.");
      }

      moveProgressTo(94);
      router.refresh();
      setProfileUpdateProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setErrorUpdate(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorUpdate(true);
    } finally {
      clearInterval(progressTimer);
      finishProfileUpdate();
      feedbackTimer = setTimeout(() => {
        setErrorUpdate(null);
      }, 2000);
    }
  };

  return (
    <div>
      <h2 className="mb-5 text-lg font-bold">Editar Perfil</h2>
      <Alert variant="warning" className="mb-2">
        Si no deseas cambiar tu contraseña, deja los campos vacíos.
      </Alert>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <FormLabel htmlFor="name" className="mb-2">
              Nombre
            </FormLabel>
            <FormInput
              id="name"
              placeholder="Ingresa tu nombre"
              {...register("name")}
            />
            {formState.errors.name && (
              <FormFeedback tone="error">
                {formState.errors.name.message}
              </FormFeedback>
            )}
          </div>
          <div>
            <FormLabel htmlFor="email" className="mb-2">
              Email
            </FormLabel>
            <FormInput
              id="email"
              placeholder="Ingresa tu email"
              {...register("email")}
            />
            {formState.errors.email && (
              <FormFeedback tone="error">
                {formState.errors.email.message}
              </FormFeedback>
            )}
          </div>
          <div>
            <FormLabel htmlFor="password" className="mb-2">
              Contraseña
            </FormLabel>
            <FormInput
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              autoComplete="new-password"
              {...register("password")}
            />
            {formState.errors.password && (
              <FormFeedback tone="error">
                {formState.errors.password.message}
              </FormFeedback>
            )}
          </div>
          <div>
            <FormLabel htmlFor="confirm-password" className="mb-2">
              Confirmar Contraseña
            </FormLabel>
            <FormInput
              id="confirm-password"
              type="password"
              placeholder="Confirma tu contraseña"
              autoComplete="new-password"
              {...register("confirm-password")}
            />
            {formState.errors["confirm-password"] && (
              <FormFeedback tone="error">
                {formState.errors["confirm-password"].message}
              </FormFeedback>
            )}
          </div>
          {errorUpdate === true && (
            <div className="col-span-full">
              <Alert variant="danger">
                Hubo un error al actualizar el perfil. Por favor, intenta de
                nuevo.
              </Alert>
            </div>
          )}
          {errorUpdate === false && (
            <div className="col-span-full">
              <Alert variant="success">
                Perfil actualizado correctamente.
              </Alert>
            </div>
          )}
        </div>
        <FormSubmit
          className="mt-4"
          loading={isUpdatingProfile}
          loadingText="Actualizando perfil..."
        >
          Guardar Cambios
        </FormSubmit>
      </Form>
    </div>
  );
};

export default FormProfile;
