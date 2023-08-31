import {FC, useState} from "react";
import {Div, ListElement} from "@/shared";
import {useDragAndDrop} from "@/widgets/Schedule/model/Schedule.hooks";
import {ScheduleFolderProps} from "@/widgets/Schedule/model/Schedule.types";
import {
    onFolderElementDoubleClick,
    onListElementClick,
    onRightButtonClick
} from "@/widgets/Schedule/model/Schedule.helpers";
import {useAppDispatch} from "../../../../store/store";
import {useSelector} from "react-redux";
import {
    getScheduleActiveItem,
    getScheduleActiveItemIndex,
    getScheduleStructure
} from "@/widgets/Schedule/model/Schedule.selectors";
import {FolderItemHeader} from "@/widgets/Schedule/ui/Folder/FolderItemHeader";
import {FolderItemList} from "@/widgets/Schedule/ui/Folder/FolderItemList";
import {FolderEditPopUp} from "@/widgets/Schedule/ui/Folder/FolderEditPopUp";
import {FolderCloseButton} from "@/widgets/Schedule/ui/Folder/FolderCloseButton";
import "./Folder/folder.css"

const ScheduleFolderItem: FC<ScheduleFolderProps> = ({
    item,
    index,
    moveScheduleItem
}) => {

    const dispatch = useAppDispatch();
    const [popUpIsShown, setPopUpIsShown] = useState<boolean>(false);
    const scheduleStructure = useSelector(getScheduleStructure);
    const scheduleActiveItem = useSelector(getScheduleActiveItem);
    const activeItemIndex = useSelector(getScheduleActiveItemIndex);
    const { opacity, handlerId, refListObject } = useDragAndDrop({item, index, moveScheduleItem});
    const folderColorLight = activeItemIndex !== undefined && handlerId === scheduleActiveItem ? "activeBorderColor" : "folderBorderColor";
    // const folderColorDark = handlerId === scheduleActiveItem ? "#5758c5" : "#e0bc56";

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
                    className={`flex flex-col relative justify-between min-h-[56px] px-3 text-[24px] text-white cursor-pointer active:cursor-grabbing border-[3px] ${folderColorLight} rounded`}
                    onDoubleClick={()=>{
                        onFolderElementDoubleClick(dispatch, scheduleStructure , item.uniqueId);
                    }}
                >
                    <FolderItemList
                        item={item}
                    />
                    <FolderCloseButton
                        index={index}
                    />
                    <FolderEditPopUp/>
                </Div>

            </ListElement>
        </>
    );

};

export {ScheduleFolderItem};