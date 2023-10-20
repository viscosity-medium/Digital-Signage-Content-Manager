import {Div, Input, Text} from "@/shared";
import {ScheduleFolderInterface} from "../../model/Schedule.types";
import {FC, useState} from "react";
import {useAppDispatch} from "@/store/store";
import {useSelector} from "react-redux";
import {getScheduleActiveDirectoryId, getScheduleStructure} from "../../model/Schedule.selectors";

import {onToggleRandomOrder} from "@/widgets/Schedule/model/helpers/ScheduleEventListeners.helpers";

export interface RandomOrderProps {
    folderItem: ScheduleFolderInterface
    fileUniqueId: string
    condition: boolean
}

const RandomOrder: FC<RandomOrderProps> = ({
    folderItem,
    fileUniqueId,
    condition
}) => {

    const dispatch = useAppDispatch();
    const [isActive, setIsActive] = useState<boolean>(folderItem.limits.randomIsActive);
    const scheduleStructure = useSelector(getScheduleStructure);
    const activeDirectoryId = useSelector(getScheduleActiveDirectoryId);

    const textColor = condition ? "whiteTextColor" : "blueTextColor";
    const opacity = isActive ? "opacity-[1]" : "opacity-[0.5]";
    const switchText = isActive ? "Отключить" : "Включить";

    return (
        <Div className={"flex items-center mt-[4px] px-[8px]"}>
            <Div
                className={`w-[308px] ${opacity}`}
            >
                <Text
                    tag={"p"}
                    className={`${textColor} text-[14px]`}
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
                        className={"w-[18px] h-[18px] outline-none"}
                        checked={isActive}
                        onChange={() => {
                            onToggleRandomOrder({
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
                        className={`ml-[8px] text-[14px] ${textColor} text-start`}
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