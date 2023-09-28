import {FC} from "react";
import {Button, Div, Hr, ListElement, Text} from "@/shared";
import CrossSvg from "@/assets/cross.svg"
import {ScheduleFileProps} from "../model/Schedule.types";
import {useDragAndDrop} from "@/widgets/Schedule/model/Schedule.hooks";
import {useSelector} from "react-redux";
import {
    getScheduleActiveDirectoryId, getScheduleActiveItem,
    getScheduleActiveItemIndex, getScheduleStructure
} from "@/widgets/Schedule/model/Schedule.selectors";
import {useAppDispatch} from "../../../../store/store";
import Image from "next/image";
import {onDeleteButtonClick, onListElementClick} from "@/widgets/Schedule/model/Schedule.helpers";
import {DateLimitations} from "@/widgets/Schedule/ui/File/DateLimitations";
import {TimeLimitations} from "@/widgets/Schedule/ui/File/TimeLimitations";

const ScheduleFileItem: FC<ScheduleFileProps> = ({
    item, index, moveScheduleItem,
}) => {

    const dispatch = useAppDispatch();
    const scheduleStructure = useSelector(getScheduleStructure);
    const scheduleActiveItem = useSelector(getScheduleActiveItem);
    const activeItemIndex = useSelector(getScheduleActiveItemIndex);
    const activeDirectoryId = useSelector(getScheduleActiveDirectoryId);
    const { opacity, handlerId, refListObject } = useDragAndDrop({item, index, moveScheduleItem, activeDirectoryId});

    const folderColorLight = activeItemIndex !== undefined && handlerId === scheduleActiveItem ? "activeBorderColor" : "whiteBorderColor";
    const folderBackgroundColor = activeItemIndex !== undefined && handlerId === scheduleActiveItem ? "activeBackgroundColor" : "whiteBackgroundColor";
    const textColor = activeItemIndex !== undefined && handlerId === scheduleActiveItem ? "whiteTextColor" : "blueTextColor";

    return (
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
            className={`flex justify-between mt-3 pr-3 min-h-[40px] text-[24px] text-white cursor-pointer active:cursor-grabbing border-[3px] ${folderColorLight} ${folderBackgroundColor} rounded`}
        >
            <Div
                className={"overflow-hidden flex items-center select-none py-[4px] px-[8px]"}
            >
                <Div
                    className={"flex items-center h-[100%]"}
                >
                    <Text
                        tag={"p"}
                        className={`min-w-[28px] ${textColor} text-center`}
                    >
                        {
                            index + 1
                        }
                    </Text>
                    <Hr
                        className={"ml-[8px] mr-[4px] w-[2px] h-[100%] bg-[#79b7bd] border-none rounded"}
                    />
                </Div>
                <Image
                    src={item.thumbnailLink}
                    alt={item.name}
                    width={120}
                    height={120}
                    className={"bg-white ml-[8px] max-h-[125px]"}
                    style={{
                        width: 'auto',
                        height: '100%',
                        objectFit: 'contain'
                    }}
                />
                <Div
                    className={"px-[8px] flex flex-col"}
                >
                    <Text
                        tag={"p"}
                        className={`${textColor} truncate px-[8px]`}
                    >
                        {
                            item.name
                        }
                    </Text>
                    <DateLimitations
                        item={item}
                        textColor={textColor}
                        fileUniqueId={item.uniqueId}
                    />
                    <TimeLimitations
                        item={item}
                        textColor={textColor}
                        fileUniqueId={item.uniqueId}
                    />
                </Div>
            </Div>
            <Button
                onClick={(event)=>{
                    event.stopPropagation();
                    onDeleteButtonClick(
                        dispatch,
                        scheduleStructure,
                        activeDirectoryId,
                        index
                    )
                }}
            >
                <CrossSvg
                    className={"w-[24px] fill-red-500"}
                />
            </Button>
        </ListElement>
    );

};

export {ScheduleFileItem};