import {Identifier} from "dnd-core";
import {toggleValidDaysSwitch} from "@/widgets/Schedule/model/DateLimitations.helpers";
import {Dispatch, SetStateAction} from "react";

export interface ScheduleFileInterface {
    id: string
    name: string
    uniqueId: string,
    type: "file"
    thumbnailLink: string
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

export interface ToggleScheduleSwitchProps {
    setIsActive: Dispatch<SetStateAction<boolean>>
}