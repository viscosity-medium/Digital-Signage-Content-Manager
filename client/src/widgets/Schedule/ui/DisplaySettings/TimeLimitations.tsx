import {TimePicker} from "antd";
import {Div, Input, Text} from "@/shared";
import {FC, useState} from "react";
import {LimitationsProps} from "../../model/Schedule.types";
import {useSelector} from "react-redux";
import {getScheduleActiveDirectoryId, getScheduleStructure} from "../../model/Schedule.selectors";
import {onTimePickerChange, onToggleValidTimeSwitch} from "../../model/helpers/TimeLimitations.helpers";
import {useAppDispatch} from "@/store/store";
import dayjs from "dayjs";

const TimeLimitations: FC<LimitationsProps> = ({
   item,
   textColor,
   fileUniqueId
}) => {

    const dispatch = useAppDispatch();
    const [isActive, setIsActive] = useState<boolean>(item.limits.timeIsActive);
    const scheduleStructure = useSelector(getScheduleStructure);
    const activeDirectoryId = useSelector(getScheduleActiveDirectoryId);

    const textWidth = "150px";
    const switchText = isActive ? "Не указывать время" : "Указать время";
    const opacity = isActive ? "opacity-[1]" : "opacity-[0.5]";
    const duration = item?.limits?.time;

    return (
        <Div
            className={"relative flex items-center mt-[4px]"}
        >
            <Div
                className={`relative flex flex-col items-start px-[8px] ${opacity}`}
            >
                {
                    isActive ?
                        null : (
                            <Div
                                className={"before:absolute before:z-[1] before:w-[100%] before:h-[100%]"}
                            />
                        )
                }
                <Div className={"flex items-center"}>
                    <Text
                        tag={"p"}
                        className={`${textColor} text-[14px] w-[${textWidth}]`}
                    >
                        Длительность
                    </Text>
                    <TimePicker
                        className={"w-[150px] h-[20px]"}
                        format={"mm:ss"}
                        value={ duration !== "default" ? dayjs(duration) : null }
                        onChange={(dayJsData) => {
                            onTimePickerChange({
                                dispatch,
                                fileUniqueId,
                                activeDirectoryId,
                                scheduleStructure,
                                itemLimits: {
                                    ...item.limits,
                                    time: dayJsData !== null ?
                                        dayJsData.toISOString() :
                                        "default"
                                }
                            })
                        }}
                    />
                </Div>
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
                            onToggleValidTimeSwitch({
                                dispatch,
                                setIsActive,
                                isActive,
                                fileUniqueId,
                                activeDirectoryId,
                                scheduleStructure,
                                itemLimits: item.limits
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

export {TimeLimitations};