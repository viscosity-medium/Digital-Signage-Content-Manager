import {StateScheme} from "../../../../store/stateScheme";

export const getScheduleStructure = (state: StateScheme) => state.schedule.scheduleStructure;
export const getScheduleActiveItem = (state: StateScheme) => state.schedule.activeItem;
export const getScheduleActiveItemIndex = (state: StateScheme) => state.schedule.activeItemIndex;
export const getScheduleActiveDirectory = (state: StateScheme) => state.schedule.activeDirectory;
export const getActiveDirectoryScheduleItems = (state: StateScheme) => state.schedule.activeDirectoryScheduleItems;