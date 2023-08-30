'use client'

import {Div, ListElement, UnorderedList} from "@/shared";
import FolderIcon from "@/assets/folder-icon.svg";
import DownArrowIcon from "@/assets/down-arrow.svg";
import {createRecursiveContent} from "@/widgets/Sidebar/model/Sidebar.helpers";
import {useRef, useState} from "react";

const SidebarFolderItem = ({
    internalProperties
}: {internalProperties:  [string, any][]}) => {

    const [isOpen, setIsOpen] = useState(true);
    const folderContentRef = useRef<HTMLUListElement>(null);

    const folderId = internalProperties[0][0];
    const folderStructure = internalProperties[0][1];
    const onFolderHeight = () => {
        setIsOpen(prevState => !prevState)
    };

    return(
        <ListElement
            key={`${folderId}`}
            className={`flex flex-col mx-[12px]`}
        >
            <Div
                className={`flex mt-[8px]`}
            >
                <Div
                    className={`flex cursor-pointer`}
                    onClick={onFolderHeight}
                >
                    <FolderIcon
                        className={`w-[20px]`}
                    />
                    <DownArrowIcon
                        className={`w-[16px] ml-[12px] ${isOpen ? "" : "rotate-180"}`}
                    />
                </Div>
            </Div>
            <Div
                className={`${isOpen ? `py-[8px] h-[auto]` : `py-[0px] h-[0]`} overflow-hidden`}
            >
                <UnorderedList
                    reference={folderContentRef}
                    className={`flex flex-col mx-[12px]`}
                >
                    {
                        createRecursiveContent({
                            structure: {
                                [folderId]: folderStructure
                            }
                        })
                    }
                </UnorderedList>
            </Div>
        </ListElement>
    )

};

export {SidebarFolderItem};