import {ItemLimits, ScheduleFileInterface, ScheduleFolderInterface, ScheduleStructure} from "./scheduleStucture.types";
import {GetSeparatedScheduleItems} from "./xml.types";

export interface GoogleFile {
    kind: string,
    mimeType: string,
    thumbnailLink: string,
    id: string,
    name: string
    limits: ItemLimits
}

export interface GoogleFolder {
    [key: string]: Array<GoogleItem> | any,
    name: string
    mimeType: string
}

export type GoogleItem = GoogleFile | GoogleFolder;

export type GetActualGoogleFilesList = (structure: GoogleItem) => string[];

export type GetSeparatedScreenSchedules = (parentItem: (ScheduleFolderInterface | ScheduleFileInterface)[]) => GetSeparatedScheduleItems;

export type CreateXmlSchedule = ({
    schedule,
    folderWithContentPath
}:{
    schedule: ScheduleStructure,
    folderWithContentPath: string
}) => string;

export type GetUniqueFilesList = (
    structure: (ScheduleFolderInterface | ScheduleFileInterface)[],
    startArray: string[]
) => string[]