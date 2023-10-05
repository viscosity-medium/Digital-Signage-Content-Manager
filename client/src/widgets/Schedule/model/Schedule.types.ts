import {Identifier} from "dnd-core";
import {Dispatch, SetStateAction} from "react";
import {Dayjs} from "dayjs";
import {AppDispatch} from "@/store/store";

export type ScheduleItemInterface = ScheduleFileInterface | ScheduleFolderInterface

export interface ScheduleFileInterface {
    id: string
    name: string
    uniqueId: string,
    type: "file"
    mimeType: string
    thumbnailLink: string
    limits: ItemFileLimits
}

export interface ScheduleFolderInterface {
    name: string
    uniqueId: string,
    type: "folder"
    content: Array<ScheduleItemInterface>
    isEditable: boolean
    limits: ItemFolderLimits
}

export interface ScheduleScheme {
    scheduleStructure: Array<ScheduleItemInterface>
    activeItem: Identifier | null
    activeItemIndex: number | undefined
    activeItemsIndexesRange: ActiveItemsIndexesRange | undefined
    activeDirectoryId: "rootDirectory" | string
    activeDirectoryName: string
    activeDirectoryScheduleItems: Array<ScheduleItemInterface>,
    scheduleBufferDataToCopy: Array<ScheduleItemInterface>
}

export interface ScheduleItemProps {
    item: ScheduleItemInterface
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
    itemUniqueId: string
    structure: Array<ScheduleItemInterface>
    itemLimits: ItemFileLimits | ItemFolderLimits
}

export interface LimitationsProps {
    item: ScheduleItemInterface
    textColor: string
    fileUniqueId: string
}

export interface OnPickerChangeProps {
    dispatch: AppDispatch
    itemLimits: ItemFileLimits
    fileUniqueId: string
    activeDirectoryId: string
    scheduleStructure: Array<ScheduleItemInterface>
}

export interface ToggleScheduleSwitchProps {
    dispatch: AppDispatch
    itemLimits: ItemFileLimits
    isActive: boolean
    fileUniqueId: string
    setIsActive: Dispatch<SetStateAction<boolean>>
    scheduleStructure: Array<ScheduleItemInterface>
    activeDirectoryId: string
}

export interface ItemFileLimits {
    date: {
        start: Dayjs | string | null | "default";
        end: Dayjs | string | null | "default";
    },
    dateIsActive: boolean
    time: Dayjs | string | "default",
    timeIsActive: boolean
}

 export interface ItemFolderLimits extends ItemFileLimits{
    randomIsActive: boolean
 }

 export interface ActiveItemsIndexesRange {
     startIndex: number
     endIndex: number
 }