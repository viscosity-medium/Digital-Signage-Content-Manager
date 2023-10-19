import {StateScheme} from "@/store/stateScheme";

export const getSidebarStructure = (state: StateScheme) => state.sidebar.structure;
export const getSearchBarValue = (state: StateScheme) => state.sidebar.searchBarValue;