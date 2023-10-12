import {FC} from "react";
import {Div, Hr, ListElement, Text} from "@/shared";
import {useDragAndDrop} from "@/widgets/Schedule/model/Schedule.hooks";
import {ScheduleFolderProps} from "@/widgets/Schedule/model/Schedule.types";
import {useAppDispatch} from "@/store/store";
import {useSelector} from "react-redux";
import {
    getScheduleActiveDirectoryId, getScheduleActiveItem,
    getScheduleActiveItemIndex, getScheduleActiveItemsIndexesRange, getScheduleStructure
} from "@/widgets/Schedule/model/Schedule.selectors";
import {FolderItemHeader} from "@/widgets/Schedule/ui/Folder/FolderItemHeader";
import {FolderItemList} from "@/widgets/Schedule/ui/Folder/FolderItemList";
import {FolderCloseButton} from "@/widgets/Schedule/ui/Folder/FolderCloseButton";
import "./Folder/folder.css"
import {useRouter, useSearchParams} from "next/navigation";
import {FolderExtraSettings} from "@/widgets/Schedule/ui/Folder/FolderExtraSettings";
import {
    onFolderElementDoubleClick,
    onListElementClick
} from "@/widgets/Schedule/model/helpers/ScheduleEventListeners.helpers";

import {createArrayFromAToB} from "@/widgets/Schedule/model/helpers/ScheduleItemsCreators.helpers";
import dayjs, {Dayjs} from "dayjs";

const ScheduleFolderItem: FC<ScheduleFolderProps> = ({
    item, index, moveScheduleItem
}) => {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const scheduleStructure = useSelector(getScheduleStructure);
    const scheduleActiveItem = useSelector(getScheduleActiveItem);
    const activeDirectoryId = useSelector(getScheduleActiveDirectoryId);
    const activeItemIndex = useSelector(getScheduleActiveItemIndex);
    const activeItemsIndexesRange = useSelector(getScheduleActiveItemsIndexesRange);
    const { opacity, handlerId, refListObject } = useDragAndDrop({item, index, moveScheduleItem, activeDirectoryId});

    const structureParams = searchParams.get("structure");
    const indexesRange = createArrayFromAToB({
        firstIndex: activeItemsIndexesRange?.startIndex,
        secondIndex: activeItemsIndexesRange?.endIndex
    });
    const condition = ((activeItemIndex !== undefined && handlerId === scheduleActiveItem) || indexesRange.includes(index));
    const folderBackgroundColor = condition ? "activeBackgroundColor" : "folderBackgroundColor";
    const folderBorderColor = condition ? "activeBorderColor" : "folderBorderColor";
    const textColor = condition ? "whiteTextColor" : "blueTextColor";

    const itemTime = item.limits.time !== "default" ? `[${dayjs(item.limits.time).toString().replace(/^.*\s\d{2}:|\s\w{3}/gm, "")}]` : "";
    const itemRandom = item.limits.randomIsActive ? `[R]` : "";

    return (
        <>
            <ListElement
                reference={refListObject}
                style={{opacity}}
                dataHandlerId={handlerId}
                onClick={(event)=>{
                    onListElementClick({
                        dispatch,
                        handlerId,
                        mouseEvent: event,
                        activeElementIndex: index,
                        previousActiveElementIndex: activeItemIndex
                    });
                }}
                className={"relative overflow-hidden flex flex-col mt-3"}
            >
                <FolderItemHeader
                    item={item}
                    condition={condition}
                />
                <Div
                    className={`flex flex-col relative justify-center min-h-[116px] p-[8px] text-[24px] text-white cursor-pointer active:cursor-grabbing border-[3px] ${folderBorderColor} ${folderBackgroundColor} rounded`}
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
                    <Div
                        className={"relative justify-between flex flex-grow-[1]"}
                    >
                        <Div
                            className={"relative flex h-[auto] top-0 bottom-0"}
                        >
                            <Text
                                tag={"p"}
                                className={`min-w-[28px] self-center text-[#000] text-center ${textColor}`}
                            >
                                {
                                    index + 1
                                }
                            </Text>
                            <Hr
                                className={"ml-[8px] mr-[4px] w-[2px] h-[100%] bg-[#79b7bd] border-none rounded"}
                            />
                            <FolderItemList
                                item={item}
                                condition={condition}
                            />
                        </Div>
                        <Text
                            tag={"h3"}
                            className={"absolute z-0 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[auto] text-[40px] text-[#ffffff60] text-center select-none"}
                        >
                            {
                                item.name
                            } {
                                itemTime
                            } {
                                itemRandom
                            }
                        </Text>
                        <Div
                            className={"self-center"}
                        >
                            <FolderCloseButton
                                item={item}
                                index={index}
                            />
                        </Div>
                    </Div>
                </Div>
                <FolderExtraSettings
                    item={item}
                    condition={condition}
                />
            </ListElement>
        </>
    );

};

export {ScheduleFolderItem};