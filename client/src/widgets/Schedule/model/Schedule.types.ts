import {Identifier} from "dnd-core";

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
}

export interface ScheduleScheme {
    scheduleStructure: Array<ScheduleFileInterface | ScheduleFolderInterface>
    activeItem: Identifier | null
    activeItemIndex: number | undefined
    activeDirectory: "rootDirectory" | string
    activeDirectoryScheduleItems: Array<ScheduleFileInterface | ScheduleFolderInterface>
}

export interface ScheduleItemProps {
    item: ScheduleFileInterface | ScheduleFolderInterface
    index: number
    moveScheduleItem: (dragIndex: number, hoverIndex: number) => void
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
