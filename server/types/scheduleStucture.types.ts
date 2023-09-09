export interface ScheduleFileInterface {
    id: string
    name: string
    uniqueId: string,
    type: "file"
    thumbnailLink: string,
    mimeType: string
}

export interface ScheduleFolderInterface {
    name: string
    uniqueId: string,
    type: "folder"
    content: Array<ScheduleFileInterface | ScheduleFolderInterface>
    isEditable: boolean
}


export type ScheduleStructure = Array<ScheduleFileInterface | ScheduleFolderInterface>