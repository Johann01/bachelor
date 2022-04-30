import create from "zustand";
import produce from "immer";
import { devtools } from "zustand/middleware";

export interface Feature {
  name: string;
  activated: boolean;
}

interface State {
  features: Feature[];
  targetFeature: Feature;
  addFeature: (featureName: string) => void;
  updateFeature: (feature: Feature) => void;
  setTargetFeature: (feature: string) => void;
}

export const useStore = create<State>(
  devtools((set) => ({
    targetFeature: { name: "", activated: false },
    features: [],
    addFeature: (feature) =>
      set(
        produce((state) => {
          state.features.push({
            name: feature,
            activated: true,
          });
        })
      ),
    updateFeature: (feature) =>
      set(
        produce((state) => {
          const selectedFeature = state.features.find(
            (el: Feature) => el.name === feature.name
          );
          selectedFeature.activated = feature.activated;
        })
      ),
    setTargetFeature: (feature) =>
      set((state) => ({
        ...state,
        targetFeature: { name: feature, activated: true },
      })),
  }))
);
