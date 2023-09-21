import {drive_v3} from "googleapis";

export interface DownloadSingleFile {
    fileID: string,
    folderPath?: string
}

export interface GoogleContentItem {
    id: string
    name: string
}

export interface ScreenContentStructure{
    day: GoogleContentItem[]
    night: GoogleContentItem[]
}

export interface SortedContentStructure {
    yabloneviy: ScreenContentStructure
    uglovoi: ScreenContentStructure
}

export interface DownloadMultipleNewFilesAndDeleteUnlistedFiles {
    contentItemPath?: string,
    googleSortedContent: SortedContentStructure
}

export interface GetFileListInFolder {searchId?: string}

export interface GetFullFileStructure {
    searchId?: string,
    name?: string,
}