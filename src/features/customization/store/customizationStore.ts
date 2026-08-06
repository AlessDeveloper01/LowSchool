"use client";

import { create } from "zustand";

import { DEFAULT_CUSTOMIZATION } from "@/features/customization/config/customizationConfig";
import { applyCustomizationToDocument } from "@/features/customization/lib/themeCustomization";
import { customizationSchema } from "@/features/customization/schemas/customizationSchema";
import { cacheCustomization } from "@/features/customization/services/customizationCache";
import type {
  Customization,
  CustomizationActionResult,
  CustomizationInput,
} from "@/features/customization/types/customization.types";

interface CustomizationState {
  settings: Customization;
  draft: CustomizationInput;
  draftDirty: boolean;
  loading: boolean;
  saving: boolean;
  result: CustomizationActionResult | null;
  initialize: (customization: Customization) => void;
  refreshFromServer: () => Promise<void>;
  updateDraft: (input: Partial<CustomizationInput>) => void;
  resetDraft: () => void;
  setSaving: (saving: boolean) => void;
  setResult: (result: CustomizationActionResult | null) => void;
  commit: (customization: Customization) => void;
}

function toInput(customization: Customization): CustomizationInput {
  return {
    appName: customization.appName,
    appSubtitle: customization.appSubtitle,
    primaryColor: customization.primaryColor,
    secondaryColor: customization.secondaryColor,
    tertiaryColor: customization.tertiaryColor,
    textColor: customization.textColor,
    currency: customization.currency,
    fontFamily: customization.fontFamily,
    logoLight: { action: "keep" },
    logoDark: { action: "keep" },
  };
}

let activeRefresh: Promise<void> | undefined;

export const useCustomizationStore = create<CustomizationState>((set, get) => ({
  settings: DEFAULT_CUSTOMIZATION,
  draft: toInput(DEFAULT_CUSTOMIZATION),
  draftDirty: false,
  loading: false,
  saving: false,
  result: null,

  initialize(customization) {
    cacheCustomization(customization);
    applyCustomizationToDocument(customization);
    set({
      settings: customization,
      draft: toInput(customization),
      draftDirty: false,
    });
  },

  async refreshFromServer() {
    if (activeRefresh) return activeRefresh;

    activeRefresh = (async () => {
      set({ loading: true });
      try {
        const response = await fetch("/api/customization", {
          cache: "no-store",
          credentials: "same-origin",
          headers: { Accept: "application/json" },
        });
        if (!response.ok) return;

        const parsed = customizationSchema.safeParse(await response.json());
        if (!parsed.success) return;

        const preserveDraft = get().draftDirty;
        cacheCustomization(parsed.data);
        if (!preserveDraft) applyCustomizationToDocument(parsed.data);
        set({
          settings: parsed.data,
          ...(preserveDraft
            ? {}
            : { draft: toInput(parsed.data), draftDirty: false }),
        });
      } catch {
        // The cached, non-sensitive customization remains active while offline.
      } finally {
        set({ loading: false });
      }
    })().finally(() => {
      activeRefresh = undefined;
    });

    return activeRefresh;
  },

  updateDraft(input) {
    const draft = { ...get().draft, ...input };
    set({ draft, draftDirty: true, result: null });
    applyCustomizationToDocument({
      ...get().settings,
      ...draft,
    });
  },

  resetDraft() {
    const settings = get().settings;
    set({ draft: toInput(settings), draftDirty: false, result: null });
    applyCustomizationToDocument(settings);
  },

  setSaving: (saving) => set({ saving }),
  setResult: (result) => set({ result }),

  commit(customization) {
    cacheCustomization(customization);
    applyCustomizationToDocument(customization);
    set({
      settings: customization,
      draft: toInput(customization),
      draftDirty: false,
    });
  },
}));
