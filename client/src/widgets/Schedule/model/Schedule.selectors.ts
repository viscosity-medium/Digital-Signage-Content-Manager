import {StateScheme} from "@/store/stateScheme";

export const getScheduleStructure = (state: StateScheme) => state.schedule.scheduleStructure;
export const getScheduleActiveItem = (state: StateScheme) => state.schedule.activeItem;
export const getScheduleActiveItemIndex = (state: StateScheme) => state.schedule.activeItemIndex;
export const getScheduleActiveItemsIndexesRange = (state: StateScheme) => state.schedule.activeItemsIndexesRange;
export const getScheduleActiveDirectoryId = (state: StateScheme) => state.schedule.activeDirectoryId;
export const getScheduleActiveDirectoryName = (state: StateScheme) => state.schedule.activeDirectoryName;
export const getActiveDirectoryScheduleItems = (state: StateScheme) => state.schedule.activeDirectoryScheduleItems;
export const getScheduleBufferDataToCopy = (state: StateScheme) => state.schedule.scheduleBufferDataToCopy;
export const getScheduleScrollProperties = (state: StateScheme) => state.schedule.scheduleScrollProperties;
export const getFullDirectoriesPath = (state: StateScheme) => state.schedule.fullDirectoriesPath;