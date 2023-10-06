'use client'

import {Div, ListElement, Text, UnorderedList} from "@/shared";
import FolderIcon from "@/assets/folder-icon.svg";
import DownArrowIcon from "@/assets/down-arrow.svg";
import {createSidebarContentRecursively, onFolderItemClick} from "@/widgets/Sidebar/model/Sidebar.helpers";
import {useRef, useState} from "react";
import {useSelector} from "react-redux";
import {getSearchBarValue} from "../model/Sidebar.selectors";
import {InternalProperties} from "../model/Sidebar.type";

const SidebarFolderItem = ({
    internalProperties
}: {
    internalProperties: InternalProperties
}) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const folderContentRef = useRef<HTMLUListElement>(null);
    const searchBarValue = useSelector(getSearchBarValue);

    const folderId = internalProperties[0][0];
    const folderName = internalProperties[1][1];
    const folderStructure = internalProperties[0][1];
    const folderFilteredContent = createSidebarContentRecursively({
        structure: {
            [folderId]: folderStructure
        },
        searchBarValue
    });

    if(folderFilteredContent[0]?.length !== 0){
        return(
            <ListElement
                key={`${folderId}`}
                className={`flex flex-col`}
            >
                <Div
                    className={`flex mt-[8px]`}
                >
                    <Div
                        className={`flex cursor-pointer`}
                        onClick={() => {
                            onFolderItemClick({setIsOpen})
                        }}
                    >
                        <FolderIcon
                            className={`w-[20px]`}
                        />
                        <DownArrowIcon
                            className={`w-[16px] mx-[12px] ${isOpen ? "" : "rotate-180"}`}
                        />
                        <Text
                            tag={"p"}
                            className={"text-[white]"}
                        >
                            {
                                folderName
                            }
                        </Text>
                    </Div>
                </Div>
                <Div
                    className={`${isOpen ? `py-[8px] h-[auto]` : `py-[0px] h-[0]`} overflow-hidden`}
                >
                    <UnorderedList
                        reference={folderContentRef}
                        className={`flex flex-col mx-[20px]`}
                    >
                        {
                            folderFilteredContent.map(item => item)
                        }
                    </UnorderedList>
                </Div>
            </ListElement>
        )
    }

};

export {SidebarFolderItem};