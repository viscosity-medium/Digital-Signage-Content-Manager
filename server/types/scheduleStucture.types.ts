import {Dayjs} from "dayjs";

export interface ItemLimits {
    date: {
        start: string | "default";
        end: string | "default";
    },
    dateIsActive: boolean
    time: string | "default",
    timeIsActive: boolean
}

export interface ScheduleFileInterface {
    id: string
    name: string
    uniqueId: string,
    type: "file"
    thumbnailLink: string,
    mimeType: string
    limits: ItemLimits
}

export interface ScheduleFolderInterface {
    name: string
    uniqueId: string,
    type: "folder"
    content: Array<ScheduleFileInterface | ScheduleFolderInterface>
    isEditable: boolean
}


export type ScheduleStructure = Array<ScheduleFileInterface | ScheduleFolderInterface>