import {Identifier} from "dnd-core";
import {Dispatch, SetStateAction} from "react";
import {Dayjs} from "dayjs";
import {AppDispatch} from "../../../../store/store";

export interface ScheduleFileInterface {
    id: string
    name: string
    uniqueId: string,
    type: "file"
    thumbnailLink: string
    limits: ItemLimits
}

export interface ScheduleFolderInterface {
    name: string
    uniqueId: string,
    type: "folder"
    content: Array<ScheduleFileInterface | ScheduleFolderInterface>
    isEditable: boolean
}

export interface ScheduleScheme {
    scheduleStructure: Array<ScheduleFileInterface | ScheduleFolderInterface>
    activeItem: Identifier | null
    activeItemIndex: number | undefined
    activeDirectoryId: "rootDirectory" | string
    activeDirectoryName: string
    activeDirectoryScheduleItems: Array<ScheduleFileInterface | ScheduleFolderInterface>
}

export interface ScheduleItemProps {
    item: ScheduleFileInterface | ScheduleFolderInterface
    index: number
    moveScheduleItem: (dragIndex: number, hoverIndex: number) => void
    activeDirectoryId: string
}

export interface ScheduleFileProps extends Omit<ScheduleItemProps, "item">{
    item: ScheduleFileInterface
}

export interface ScheduleFolderProps extends Omit<ScheduleItemProps, "item">{
    item: ScheduleFolderInterface
}

export interface DragItem {
    index: number
    id: string
    type: string
}

export enum StaticFolders {
    "rootDirectory" = "rootDirectory",
    "Yabloneviy" = "Yabloneviy",
    "Uglovoi" = "Uglovoi",
    "Day" = "Day",
    "Night" = "Night"
}

export interface GetSeparatedScheduleItems {
    [StaticFolders.Yabloneviy]: {
        [StaticFolders.Day]: ScheduleFolderInterface[],
        [StaticFolders.Night]: ScheduleFolderInterface[]
    },
    [StaticFolders.Uglovoi]: {
        [StaticFolders.Day]: ScheduleFolderInterface[],
        [StaticFolders.Night]: ScheduleFolderInterface[]
    }
}

export interface FindFileRecursively {
    fileUniqueId: string
    structure: (ScheduleFileInterface | ScheduleFolderInterface)[]
    itemLimits: ItemLimits
}

export interface LimitationsProps {
    fileItem: ScheduleFileInterface
    textColor: string
    fileUniqueId: string
}

export interface OnPickerChangeProps {
    dispatch: AppDispatch
    itemLimits: ItemLimits
    fileUniqueId: string
    activeDirectoryId: string
    scheduleStructure: (ScheduleFileInterface | ScheduleFolderInterface)[]
}

export interface ToggleScheduleSwitchProps {
    dispatch: AppDispatch
    itemLimits: ItemLimits
    isActive: boolean
    fileUniqueId: string
    setIsActive: Dispatch<SetStateAction<boolean>>
    scheduleStructure: (ScheduleFileInterface | ScheduleFolderInterface)[]
    activeDirectoryId: string
}

export interface ItemLimits {
    date: {
        start: Dayjs | string | null | "default";
        end: Dayjs | string | null | "default";
    },
    dateIsActive: boolean
    time: Dayjs | string | "default",
    timeIsActive: boolean
}