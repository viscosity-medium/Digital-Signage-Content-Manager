import {FC} from "react";
import {Button, Div, ListElement, Text} from "@/shared";
import CrossSvg from "@/assets/cross.svg"
import {ScheduleFileProps} from "../model/Schedule.types";
import {useDragAndDrop} from "@/widgets/Schedule/model/Schedule.hooks";
import {useSelector} from "react-redux";
import {
    getScheduleActiveDirectoryId,
    getScheduleActiveItem, getScheduleActiveItemIndex,
    getScheduleStructure
} from "@/widgets/Schedule/model/Schedule.selectors";
import {useAppDispatch} from "../../../../store/store";
import Image from "next/image";
import {onDeleteButtonClick, onListElementClick} from "@/widgets/Schedule/model/Schedule.helpers";

const ScheduleFileItem: FC<ScheduleFileProps> = ({
    item,
    index,
    moveScheduleItem,
}) => {

    const dispatch = useAppDispatch();
    const scheduleStructure = useSelector(getScheduleStructure);
    const scheduleActiveItem = useSelector(getScheduleActiveItem);
    const activeDirectoryId = useSelector(getScheduleActiveDirectoryId);
    const activeItemIndex = useSelector(getScheduleActiveItemIndex);
    const {
        opacity, handlerId, refListObject
    } = useDragAndDrop({item, index, moveScheduleItem, activeDirectoryId});

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
            <Div className={"flex items-center select-none"}>
                <Image
                    src={item.thumbnailLink}
                    alt={item.name}
                    width={50}
                    height={50}
                    className={"bg-white"}
                    style={{
                        width: '50px',
                        height: 'auto',
                        objectFit: 'contain'
                    }}
                />
                <Text
                    tag={"p"}
                    className={`ml-3 pr-[20px] ${textColor} truncate`}
                >
                    {
                        item.name
                    }
                </Text>
            </Div>
            <Button
                onClick={()=>{
                    onDeleteButtonClick(dispatch, scheduleStructure,activeDirectoryId, index)
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