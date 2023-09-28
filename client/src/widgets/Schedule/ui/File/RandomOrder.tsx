import {Div, Input, Text} from "@/shared";
import {TimePicker} from "antd";
import dayjs from "dayjs";
import {onTimePickerChange, onToggleValidTimeSwitch} from "@/widgets/Schedule/model/TimeLimitations.helpers";
import {ScheduleFileInterface, ScheduleFolderInterface} from "@/widgets/Schedule/model/Schedule.types";
import {FC, useState} from "react";
import {useAppDispatch} from "../../../../../store/store";
import {useSelector} from "react-redux";
import {
    getScheduleActiveDirectoryId,
    getScheduleActiveItem, getScheduleActiveItemIndex,
    getScheduleStructure
} from "@/widgets/Schedule/model/Schedule.selectors";
import {Identifier} from "dnd-core";
import {onToggleRandomOrderSwitch} from "@/widgets/Schedule/model/RandomOrder.helpers";

export interface RandomOrderProps {
    folderItem: ScheduleFolderInterface
    handlerId: Identifier | null
    fileUniqueId: string
}

const RandomOrder: FC<RandomOrderProps> = ({
    handlerId,
    folderItem,
    fileUniqueId
}) => {

    const dispatch = useAppDispatch();
    const [isActive, setIsActive] = useState<boolean>(folderItem.limits.randomIsActive);
    const scheduleStructure = useSelector(getScheduleStructure);
    const activeDirectoryId = useSelector(getScheduleActiveDirectoryId);
    const scheduleActiveItem = useSelector(getScheduleActiveItem);
    const activeItemIndex = useSelector(getScheduleActiveItemIndex);

    const textColor = activeItemIndex !== undefined && handlerId === scheduleActiveItem ? "whiteTextColor" : "blueTextColor";
    const opacity = isActive ? "opacity-[1]" : "opacity-[0.5]";
    const switchText = isActive ? "Отключить" : "Включить";

    return (
        <Div className={"flex items-center px-[8px]"}>
            <Div
                className={`w-[308px] ${opacity}`}
            >
                <Text
                    tag={"p"}
                    className={`${textColor} text-[16px]`}
                >
                    Произвольный порядок проигрывания
                </Text>
            </Div>
            <Div
                className={"flex flex-col justify-center items-center ml-[12px]"}
            >
                <Div
                    className={"flex items-center w-[200px]"}
                >
                    <Input
                        type={"checkbox"}
                        className={"w-[20px] h-[20px] outline-none"}
                        checked={isActive}
                        onChange={() => {
                            onToggleRandomOrderSwitch({
                                scheduleStructure,
                                activeDirectoryId,
                                fileUniqueId,
                                setIsActive,
                                itemLimits: folderItem.limits,
                                dispatch,
                                isActive
                            })
                        }}
                    />
                    <Text
                        tag={"p"}
                        className={`ml-[8px] text-[16px] ${textColor} text-start`}
                    >
                        {
                            switchText
                        }
                    </Text>
                </Div>
            </Div>
        </Div>
    );

};

export {RandomOrder};