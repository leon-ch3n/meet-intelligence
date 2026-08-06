import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ActionItemStatus,
  DecisionStatus,
  Visibility,
} from "@/types";

/**
 * Client-side mutation store. Additive over the seeded data — reads merge
 * seed rows with any overrides here rather than replacing seeds wholesale.
 * The Notes tab (confirm/edit/dismiss controls) writes here; server services
 * stay pure over the seed and never see this state.
 */

export type DecisionOverride = {
  id: string;
  status?: DecisionStatus | "dismissed";
  text?: string;
  effectiveDate?: string;
  visibility?: Visibility;
  confirmedAt?: string;
};

export type ActionOverride = {
  id: string;
  status?: ActionItemStatus | "dismissed";
  text?: string;
  ownerId?: string;
  dueDate?: string;
  visibility?: Visibility;
  confirmedAt?: string;
};

export type InsightOverride = {
  id: string;
  status?: "confirmed" | "dismissed";
  visibility?: Visibility;
};

export type AppState = {
  decisionOverrides: Record<string, DecisionOverride>;
  actionOverrides: Record<string, ActionOverride>;
  insightOverrides: Record<string, InsightOverride>;
  hydrated: boolean;

  confirmDecision: (id: string, patch?: Partial<DecisionOverride>) => void;
  editDecision: (id: string, patch: Partial<DecisionOverride>) => void;
  dismissDecision: (id: string) => void;
  confirmAction: (id: string, patch?: Partial<ActionOverride>) => void;
  editAction: (id: string, patch: Partial<ActionOverride>) => void;
  dismissAction: (id: string) => void;
  completeAction: (id: string) => void;
  setInsightVisibility: (id: string, visibility: Visibility) => void;
  acknowledgeInsight: (id: string) => void;
  dismissInsight: (id: string) => void;
  reset: () => void;
};

const initialState = {
  decisionOverrides: {},
  actionOverrides: {},
  insightOverrides: {},
  hydrated: false,
} satisfies Omit<
  AppState,
  | "confirmDecision"
  | "editDecision"
  | "dismissDecision"
  | "confirmAction"
  | "editAction"
  | "dismissAction"
  | "completeAction"
  | "setInsightVisibility"
  | "acknowledgeInsight"
  | "dismissInsight"
  | "reset"
>;

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      confirmDecision: (id, patch) =>
        set((state) => ({
          decisionOverrides: {
            ...state.decisionOverrides,
            [id]: {
              ...state.decisionOverrides[id],
              id,
              status: "confirmed",
              confirmedAt: new Date().toISOString(),
              ...patch,
            },
          },
        })),

      editDecision: (id, patch) =>
        set((state) => ({
          decisionOverrides: {
            ...state.decisionOverrides,
            [id]: {
              ...state.decisionOverrides[id],
              id,
              ...patch,
            },
          },
        })),

      dismissDecision: (id) =>
        set((state) => ({
          decisionOverrides: {
            ...state.decisionOverrides,
            [id]: {
              ...state.decisionOverrides[id],
              id,
              status: "dismissed",
            },
          },
        })),

      confirmAction: (id, patch) =>
        set((state) => ({
          actionOverrides: {
            ...state.actionOverrides,
            [id]: {
              ...state.actionOverrides[id],
              id,
              status: "open",
              confirmedAt: new Date().toISOString(),
              ...patch,
            },
          },
        })),

      editAction: (id, patch) =>
        set((state) => ({
          actionOverrides: {
            ...state.actionOverrides,
            [id]: {
              ...state.actionOverrides[id],
              id,
              ...patch,
            },
          },
        })),

      dismissAction: (id) =>
        set((state) => ({
          actionOverrides: {
            ...state.actionOverrides,
            [id]: {
              ...state.actionOverrides[id],
              id,
              status: "dismissed",
            },
          },
        })),

      completeAction: (id) =>
        set((state) => ({
          actionOverrides: {
            ...state.actionOverrides,
            [id]: {
              ...state.actionOverrides[id],
              id,
              status: "completed",
            },
          },
        })),

      setInsightVisibility: (id, visibility) =>
        set((state) => ({
          insightOverrides: {
            ...state.insightOverrides,
            [id]: {
              ...state.insightOverrides[id],
              id,
              visibility,
            },
          },
        })),

      acknowledgeInsight: (id) =>
        set((state) => ({
          insightOverrides: {
            ...state.insightOverrides,
            [id]: {
              ...state.insightOverrides[id],
              id,
              status: "confirmed",
            },
          },
        })),

      dismissInsight: (id) =>
        set((state) => ({
          insightOverrides: {
            ...state.insightOverrides,
            [id]: {
              ...state.insightOverrides[id],
              id,
              status: "dismissed",
            },
          },
        })),

      reset: () => set({ ...initialState, hydrated: true }),
    }),
    {
      name: "meet-intelligence:v1",
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);
