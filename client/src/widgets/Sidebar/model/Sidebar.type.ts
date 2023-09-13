import { AppDispatch } from "../../../../store/store"
import {Dayjs} from "dayjs";

export interface SidebarStructureItem {
    kind: string,
    mimeType: string,
    id: string,
    name: string
    thumbnailLink: string
    limits: {
        date: Dayjs | "default",
        time: Dayjs | "default"
    }
}

export interface SidebarFileItemProps {
    internalItem: SidebarStructureItem
}

export interface SidebarStructure {
    [key: string]: Array<SidebarStructureItem | SidebarStructure>
}

export interface CreateRecursiveContent {
    structure: SidebarStructure
    searchBarValue: string
}

export interface SidebarScheme {
    structure: SidebarStructure
    searchBarValue: string
}
