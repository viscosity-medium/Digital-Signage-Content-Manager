import {Dayjs} from "dayjs";
import {ScheduleItemInterface} from "./scheduleStucture.types";

export type ComputeRange<
    N extends number,
    Result extends Array<unknown> = [],
> = (Result['length'] extends N ? Result : ComputeRange<N, [...Result, Result['length']]>)


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

export interface ScheduleFileInterface {
    id: string
    name: string
    uniqueId: string,
    type: "file"
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