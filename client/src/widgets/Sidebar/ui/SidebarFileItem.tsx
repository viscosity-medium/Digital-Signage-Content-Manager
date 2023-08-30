import {Div, ListElement, Text} from "@/shared";
import {SidebarFileItemProps} from "@/widgets/Sidebar/model/Sidebar.type";
import {
    getActiveDirectoryScheduleItems,
    getScheduleActiveDirectory,
    getScheduleActiveItem, getScheduleActiveItemIndex,
    getScheduleStructure
} from "@/widgets/Schedule/model/Schedule.selectors";
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../../../store/store";
import Image from "next/image";
import {onListElementClick} from "../model/Sidebar.helpers";
import {FC, useRef} from "react";

const SidebarFileItem: FC<SidebarFileItemProps> = ({
    internalItem,
}) => {

    const refObj = useRef<HTMLDivElement>(null);
    const schedule = useSelector(getScheduleStructure);
    const scheduleActiveDirectory = useSelector(getScheduleActiveDirectory);
    const activeItems = useSelector(getActiveDirectoryScheduleItems);
    const activeItemIndex = useSelector(getScheduleActiveItemIndex);
    const dispatch = useAppDispatch();


    return(
        <ListElement
            key={`${internalItem.id}`}
            draggable
            className={"my-[2px] px-[12px]"}
            style={{
                height: refObj.current?.clientHeight
            }}
            onClick={()=>{
                onListElementClick(dispatch, schedule, internalItem, scheduleActiveDirectory, activeItemIndex !== undefined ? activeItemIndex : activeItems.length - 1)
            }}
        >
            <Div
                reference={refObj}
                className={`flex items-center cursor-pointer active:scale-[105%] active:bg-[#231aad8c]`}
            >
                <Image
                    src={internalItem.thumbnailLink}
                    alt={internalItem.name}
                    width={50}
                    height={50}
                    className={"bg-white"}
                    style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'contain'
                    }}
                />
                <Text
                    tag={`p`}
                    className={`ml-[12px] text-[16px] text-[#ffffffb3] select-none`}
                >
                    {`${internalItem.name}`}
                </Text>
            </Div>
        </ListElement>
    )

};

export {SidebarFileItem};