import { toggleFilter } from "@/shared/lib/toggleFilter";
import type { Sex } from "@/entities/user/model/user";

export interface FilterState {
  searchQuery: string;
  selectedGrades: number[];
  selectedClasses: number[];
  selectedGender: Sex | null;
}

export type FilterAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "TOGGLE_GRADE"; payload: number }
  | { type: "TOGGLE_CLASS"; payload: number }
  | { type: "SET_GENDER"; payload: Sex | null }
  | { type: "RESET" };

export const initialFilterState: FilterState = {
  searchQuery: "",
  selectedGrades: [],
  selectedClasses: [],
  selectedGender: null,
};

export function filterReducer(
  state: FilterState,
  action: FilterAction,
): FilterState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "TOGGLE_GRADE":
      return {
        ...state,
        selectedGrades: toggleFilter(state.selectedGrades, action.payload),
      };
    case "TOGGLE_CLASS":
      return {
        ...state,
        selectedClasses: toggleFilter(state.selectedClasses, action.payload),
      };
    case "SET_GENDER":
      return { ...state, selectedGender: action.payload };
    case "RESET":
      return initialFilterState;
  }
}
