import {ComputeRange} from "./types";
import {ScheduleFolderInterface} from "./scheduleStucture.types";

// black-picture_[turn-off-screen] xml
export type Hours24 = 24;
export type Minutes60 = 60;
export type Hours24Range = ComputeRange<Hours24>[number]
export type Minutes60Range = ComputeRange<Minutes60>[number]

export interface DateTime {
    hours24: Hours24Range,
    minutes60: Minutes60Range
}

export interface BlackPictureProps {
    dateTime: DateTime
    contentDurationTime: DateTime
}


export enum StaticFolders {
    "rootDirectory" = "rootDirectory",
    "Yabloneviy" = "Yabloneviy",
    "Uglovoi" = "Uglovoi",
    "Day" = "Day",
    "Night" = "Night"
}

export enum StaticFoldersGoogle {
    "rootDirectory" = "rootDirectory",
    "yabloneviy" = "yabloneviy",
    "uglovoi" = "uglovoi",
    "day" = "day",
    "night" = "night"
}

export interface GetSeparatedScheduleItems {
    [StaticFolders.Yabloneviy]: {
        [StaticFolders.Day]: ScheduleFolderInterface | undefined
        [StaticFolders.Night]: ScheduleFolderInterface | undefined
    },
    [StaticFolders.Uglovoi]: {
        [StaticFolders.Day]: ScheduleFolderInterface | undefined
        [StaticFolders.Night]: ScheduleFolderInterface | undefined
    }
}
