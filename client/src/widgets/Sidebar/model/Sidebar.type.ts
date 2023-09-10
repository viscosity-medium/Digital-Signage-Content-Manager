import { AppDispatch } from "../../../../store/store"

export interface SidebarStructureItem {
    kind: string,
    mimeType: string,
    id: string,
    name: string
    thumbnailLink: string
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
