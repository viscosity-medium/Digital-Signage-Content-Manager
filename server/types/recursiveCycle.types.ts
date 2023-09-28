import {ItemFileLimits, ScheduleFileInterface, ScheduleFolderInterface, ScheduleStructure} from "./scheduleStucture.types";
import {GetSeparatedScheduleItems} from "./xml.types";

export interface GoogleFile {
    kind: string,
    mimeType: string,
    thumbnailLink: string,
    id: string,
    name: string
    limits: ItemFileLimits
}

export interface GoogleFolder {
    [key: string]: Array<GoogleItem> | any,
    name: string
    mimeType: string
}

export type GoogleItem = GoogleFile | GoogleFolder;

export type GetActualGoogleFilesList = (structure: GoogleItem) => string[];

export type GetSeparatedScreenSchedules = (parentItem: (ScheduleFolderInterface | ScheduleFileInterface)[]) => GetSeparatedScheduleItems;

export interface DataForXml {
    schedule: ScheduleStructure,
    folderWithContentPath: string
}

export type CreateXmlSchedule = ({
    schedule,
    folderWithContentPath
}: DataForXml) => string;

export interface DataForMultipleXmlFiles {
    YabloneviyDaySchedule: DataForXml,
    YabloneviyNightSchedule: DataForXml,
    UglovoiDaySchedule: DataForXml,
    UglovoiNightSchedule: DataForXml;
}

export type CreateMultipleXmlSchedules = (data: DataForMultipleXmlFiles) => ({
    YabloneviyDaySchedule: string,
    YabloneviyNightSchedule: string,
    UglovoiDaySchedule: string,
    UglovoiNightSchedule: string
})

export type GetUniqueFilesList = (
    structure: (ScheduleFolderInterface | ScheduleFileInterface)[],
    startArray: string[]
) => string[]