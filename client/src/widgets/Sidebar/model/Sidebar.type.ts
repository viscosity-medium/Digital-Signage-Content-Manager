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

export interface SidebarScheme {
    structure: SidebarStructure
}
