import {Dayjs} from "dayjs";

export interface ItemFileLimits {
    date: {
        start: string | "default";
        end: string | "default";
    },
    dateIsActive: boolean
    time: string | "default",
    timeIsActive: boolean
}

export interface ItemFolderLimits extends ItemFileLimits{
    randomIsActive: boolean
}

export interface ScheduleFileInterface {
    id: string
    name: string
    uniqueId: string,
    type: "file"
    thumbnailLink: string,
    mimeType: string
    limits: ItemFileLimits
}

export interface ScheduleFolderInterface {
    name: string
    uniqueId: string,
    type: "folder"
    content: Array<ScheduleFileInterface | ScheduleFolderInterface>
    isEditable: boolean
    limits: ItemFolderLimits
}


export type ScheduleStructure = Array<ScheduleFileInterface | ScheduleFolderInterface>