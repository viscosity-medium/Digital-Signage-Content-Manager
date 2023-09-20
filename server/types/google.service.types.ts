import {drive_v3} from "googleapis";

export interface DownloadSingleFile {
    fileID: string,
    folderPath?: string
}

export interface DownloadMultipleNewFilesAndDeleteUnlistedFiles {
    contentItemId?: string,
    contentItemPath?: string,
    googleFolder: string | { [p: string]: drive_v3.Schema$File[] | any}
}

export interface GetFileListInFolder {searchId?: string}

export interface GetFullFileStructure {
    searchId?: string,
    name?: string,
    mimeType?: string
}