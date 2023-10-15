import {FC} from "react";
import {Button, Div, Hr, ListElement, Text} from "@/shared";
import CrossSvg from "@/assets/cross.svg";
import NoImg from "@/assets/no-image.jpg";
import {ScheduleFileProps} from "../../model/Schedule.types";
import {useDragAndDrop} from "../../model/hooks/Schedule.hooks";
import {useSelector} from "react-redux";
import {
    getScheduleActiveDirectoryId, getScheduleActiveItem, getScheduleStructure,
    getScheduleActiveItemIndex, getScheduleActiveItemsIndexesRange,
} from "../../model/Schedule.selectors";
import {useAppDispatch} from "@/store/store";
import Image from "next/image";
import {DateLimitations} from "../DisplaySettings/DateLimitations";
import {TimeLimitations} from "../DisplaySettings/TimeLimitations";
import {onDeleteButtonClick, onListElementClick} from "../../model/helpers/ScheduleEventListeners.helpers";

import {createArrayFromAToB} from "../../model/helpers/ScheduleItemsCreators.helpers";

const ScheduleFileItem: FC<ScheduleFileProps> = ({
    item, index, moveScheduleItem,
}) => {

    const dispatch = useAppDispatch();
    const scheduleStructure = useSelector(getScheduleStructure);
    const scheduleActiveItem = useSelector(getScheduleActiveItem);
    const activeItemIndex = useSelector(getScheduleActiveItemIndex);
    const activeDirectoryId = useSelector(getScheduleActiveDirectoryId);
    const activeItemsIndexesRange = useSelector(getScheduleActiveItemsIndexesRange);
    const { opacity, handlerId, refListObject } = useDragAndDrop({item, index, moveScheduleItem, activeDirectoryId});

    const indexesRange = createArrayFromAToB({
        firstIndex: activeItemsIndexesRange?.startIndex,
        secondIndex: activeItemsIndexesRange?.endIndex
    });
    const condition = ((activeItemIndex !== undefined && handlerId === scheduleActiveItem) || indexesRange.includes(index));
    const fileBackgroundColor = condition ? "activeBackgroundColor" : "whiteBackgroundColor";
    const fileColorLight = condition ? "activeBorderColor" : "whiteBorderColor";
    const textColor = condition ? "whiteTextColor" : "blueTextColor";

    return (
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
            className={`flex justify-between mt-3 pr-3 min-h-[40px] text-[24px] text-white cursor-pointer active:cursor-grabbing border-[3px] ${fileColorLight} ${fileBackgroundColor} rounded`}
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
                    src={item.thumbnailLink || NoImg}
                    alt={item.name}
                    width={120}
                    height={120}
                    className={"bg-white ml-[8px] max-h-[125px]"}
                    style={{
                        width: '120px',
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