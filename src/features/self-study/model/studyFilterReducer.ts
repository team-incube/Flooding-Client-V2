import { toggleFilter } from "@/shared/lib/toggleFilter";

export interface FilterState {
  searchQuery: string;
  selectedGrades: number[];
  selectedClasses: number[];
}

export type FilterAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "TOGGLE_GRADE"; payload: number }
  | { type: "TOGGLE_CLASS"; payload: number }
  | { type: "RESET" };

export const initialFilterState: FilterState = {
  searchQuery: "",
  selectedGrades: [],
  selectedClasses: [],
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
    case "RESET":
      return initialFilterState;
  }
}
