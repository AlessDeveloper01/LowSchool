import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { SessionUser } from "@/features/auth/types/auth.types";
import { getProfileAction } from "@/features/profile/actions/getProfile.action";

export interface ProfileState {
  profile: SessionUser | null;
  lastFetched: number | null;
  isLoading: boolean;
  isUpdatingProfile: boolean;
  profileUpdateProgress: number;
  getProfile: (force?: boolean) => Promise<boolean>;
  clearProfile: () => void;
  errorUpdate: boolean | null;
  setErrorUpdate: (value: boolean | null) => void;
  startProfileUpdate: () => void;
  setProfileUpdateProgress: (value: number) => void;
  finishProfileUpdate: () => void;
}

const CACHE_TIME = 24 * 60 * 60 * 1000;

let inFlightRequest: Promise<boolean> | null = null;

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      lastFetched: null,
      isLoading: false,
      isUpdatingProfile: false,
      profileUpdateProgress: 0,
      errorUpdate: null,

      getProfile: async (force = false) => {
        const { profile, lastFetched } = get();
        const isFresh =
          Boolean(profile) &&
          Boolean(lastFetched) &&
          Date.now() - (lastFetched ?? 0) < CACHE_TIME;

        if (!force && isFresh) return true;
        if (inFlightRequest) return inFlightRequest;

        inFlightRequest = (async () => {
          set({ isLoading: true });
          try {
            const user = await getProfileAction();
            set({ profile: user, lastFetched: Date.now(), isLoading: false });
            return user !== null;
          } catch (error) {
            set({ isLoading: false });
            console.error("Error fetching profile:", error);
            return false;
          } finally {
            inFlightRequest = null;
          }
        })();

        return inFlightRequest;
      },

      clearProfile: () => set({ profile: null, lastFetched: null }),
      setErrorUpdate: (value) => set({ errorUpdate: value }),
      startProfileUpdate: () =>
        set({ isUpdatingProfile: true, profileUpdateProgress: 8 }),
      setProfileUpdateProgress: (value) =>
        set({
          profileUpdateProgress: Math.min(
            100,
            Math.max(0, Math.round(value)),
          ),
        }),
      finishProfileUpdate: () =>
        set({ isUpdatingProfile: false, profileUpdateProgress: 0 }),
    }),
    {
      name: "profile-storage",
      partialize: (state) => ({
        profile: state.profile,
        lastFetched: state.lastFetched,
      }),
    },
  ),
);
