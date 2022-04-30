import create from "zustand";
import produce from "immer";
import { devtools } from "zustand/middleware";
import InspectionView from "@components/InspectionView";

export interface Feature {
  name: string;
  activated: boolean;
}

interface State {
  xaiMethod: "LIME" | "DeepLift";
  inspectionView: string | "Global";
  inspectionViewData: string[];
  timestepSegment: [number, number] | null;
  dataset: string | undefined;
  model: string | undefined;
  setXAIMethod: (method: "LIME" | "DeepLift") => void;
  setInspectionView: (date: string | "Global") => void;
  setInspectionViewData: (date: string[]) => void;
  setTimestepSegment: (segment: [number, number]) => void;
  setDataset: (name: string) => void;
  setModel: (name: string) => void;
}

export const useStore = create<State>(
  devtools((set) => ({
    xaiMethod: "LIME",
    inspectionView: "Global",
    inspectionViewData: ["Global"],
    timestepSegment: null,
    dataset: "df_clean.csv",
    model: "model.pt",
    setXAIMethod: (method: "LIME" | "DeepLift") =>
      set((state) => ({
        ...state,
        xaiMethod: method,
      })),

    setInspectionView: (date: string | "Global") =>
      set((state) => ({
        ...state,
        inspectionView: date,
      })),
    setInspectionViewData: (dates: string[]) =>
      set((state) => ({
        ...state,
        inspectionViewData: [...dates, ...state.inspectionViewData],
      })),
    setTimestepSegment: (segment: [number, number]) =>
      set((state) => ({
        ...state,
        timestepSegment: segment,
      })),
    setDataset: (name: string) =>
      set((state) => ({
        ...state,
        dataset: name,
      })),
    setModel: (name: string) =>
      set((state) => ({
        ...state,
        model: name,
      })),
  }))
);
