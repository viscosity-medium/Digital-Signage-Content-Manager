import {FC} from "react";
import {Div, ListElement, Text} from "@/shared";
import {useDragAndDrop} from "@/widgets/Schedule/model/Schedule.hooks";
import {ScheduleFolderProps} from "@/widgets/Schedule/model/Schedule.types";
import {onFolderElementDoubleClick, onListElementClick} from "@/widgets/Schedule/model/Schedule.helpers";
import {useAppDispatch} from "../../../../store/store";
import {useSelector} from "react-redux";
import {
    getScheduleActiveDirectoryId,
    getScheduleActiveItem,
    getScheduleActiveItemIndex,
    getScheduleStructure
} from "@/widgets/Schedule/model/Schedule.selectors";
import {FolderItemHeader} from "@/widgets/Schedule/ui/Folder/FolderItemHeader";
import {FolderItemList} from "@/widgets/Schedule/ui/Folder/FolderItemList";
import {FolderCloseButton} from "@/widgets/Schedule/ui/Folder/FolderCloseButton";
import "./Folder/folder.css"
import { useRouter, useSearchParams } from "next/navigation";

const ScheduleFolderItem: FC<ScheduleFolderProps> = ({
    item,
    index,
    moveScheduleItem
}) => {

    const dispatch = useAppDispatch();
    const scheduleStructure = useSelector(getScheduleStructure);
    const scheduleActiveItem = useSelector(getScheduleActiveItem);
    const activeDirectoryId = useSelector(getScheduleActiveDirectoryId)
    const activeItemIndex = useSelector(getScheduleActiveItemIndex);
    const { opacity, handlerId, refListObject } = useDragAndDrop({item, index, moveScheduleItem, activeDirectoryId});
    const folderBorderColor = activeItemIndex !== undefined && handlerId === scheduleActiveItem ? "activeBorderColor" : "folderBorderColor";
    const folderBackgroundColor = activeItemIndex !== undefined && handlerId === scheduleActiveItem ? "activeBackgroundColor" : "folderBackgroundColor";

    const searchParams = useSearchParams();
    const router = useRouter();
    const structureParams = searchParams.get("structure");

    return (
        <>
            <ListElement
                reference={refListObject}
                style={{opacity}}
                dataHandlerId={handlerId}
                onClick={()=>{
                    onListElementClick(dispatch, handlerId, index);
                }}
                onDragStart={()=>{
                    onListElementClick(dispatch, handlerId, index);
                }}
                className={"overflow-hidden flex flex-col mt-3"}
            >

                <FolderItemHeader
                    item={item}
                    handlerId={handlerId}
                />

                <Div
                    className={`flex flex-col relative justify-center min-h-[72px] px-3 text-[24px] text-white cursor-pointer active:cursor-grabbing border-[3px] ${folderBorderColor} ${folderBackgroundColor} rounded`}
                    onDoubleClick={()=>{
                        onFolderElementDoubleClick(
                            dispatch, 
                            scheduleStructure, 
                            item.uniqueId, 
                            item.name,
                            router,
                            structureParams
                        );
                    }}
                >
                    <FolderItemList
                        item={item}
                        handlerId={handlerId}
                    />
                    <Text
                        tag={"h3"}
                        className={"absolute z-0 ml-auto mr-auto left-0 right-0 text-[40px] text-[#ffffff60] text-center select-none"}
                    >
                        {
                            item.name
                        }
                    </Text>
                    <FolderCloseButton
                        item={item}
                        index={index}
                    />
                    {/*<FolderEditPopUp/>*/}
                </Div>

            </ListElement>
        </>
    );

};

export {ScheduleFolderItem};