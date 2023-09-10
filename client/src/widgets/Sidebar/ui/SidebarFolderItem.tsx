'use client'

import {Div, ListElement, Text, UnorderedList} from "@/shared";
import FolderIcon from "@/assets/folder-icon.svg";
import DownArrowIcon from "@/assets/down-arrow.svg";
import {createRecursiveContent} from "@/widgets/Sidebar/model/Sidebar.helpers";
import {useRef, useState} from "react";
import { useAppDispatch } from "../../../../store/store";
import { useSelector } from "react-redux";
import { getSearchBarValue } from "../model/Sidebar.selectors";

const SidebarFolderItem = ({
    internalProperties
}: {internalProperties:  [string, any][]}) => {

    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(true);
    const folderContentRef = useRef<HTMLUListElement>(null);
    const searchBarValue = useSelector(getSearchBarValue);

    const folderId = internalProperties[0][0];
    const folderStructure = internalProperties[0][1];
    const folderName = internalProperties[1][1];
    const onFolderHeight = () => {
        setIsOpen(prevState => !prevState);
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
                    className={`flex flex-col mx-[12px]`}
                >
                    {
                        createRecursiveContent({
                            structure: {
                                [folderId]: folderStructure
                            },
                            searchBarValue
                        })
                    }
                </UnorderedList>
            </Div>
        </ListElement>
    )

};

export {SidebarFolderItem};