import {StateScheme} from "../../../../store/stateScheme";

export const getScheduleStructure = (state: StateScheme) => state.schedule.scheduleStructure;
export const getScheduleActiveItem = (state: StateScheme) => state.schedule.activeItem;
export const getScheduleActiveItemIndex = (state: StateScheme) => state.schedule.activeItemIndex;
export const getScheduleActiveDirectoryId = (state: StateScheme) => state.schedule.activeDirectoryId;
export const getScheduleActiveDirectoryName = (state: StateScheme) => state.schedule.activeDirectoryName;
export const getActiveDirectoryScheduleItems = (state: StateScheme) => state.schedule.activeDirectoryScheduleItems;