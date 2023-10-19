import {ItemFileLimits} from "../../Schedule/model/Schedule.types";

export interface SidebarStructureItem {
    id: string,
    name: string
    kind: string,
    mimeType: string,
    thumbnailLink: string
    limits: ItemFileLimits
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

export type InternalProperties = [
    [string, SidebarStructureItem[]],
    ["name", string],
    ["mimeType", string],
]
