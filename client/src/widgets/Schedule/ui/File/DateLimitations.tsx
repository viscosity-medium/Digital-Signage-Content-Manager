import {DatePicker} from "antd";
import {Div, Input, Text} from "@/shared";
import {FC, useState} from "react";
import {onDatePickerChange, onToggleValidDaysSwitch} from "@/widgets/Schedule/model/DateLimitations.helpers";
import {LimitationsProps} from "@/widgets/Schedule/model/Schedule.types";
import {useSelector} from "react-redux";
import {getScheduleStructure} from "@/widgets/Schedule/model/Schedule.selectors";
import {useAppDispatch} from "../../../../../store/store";

const DateLimitations: FC<LimitationsProps> = ({
    fileItem,
    textColor,
    fileUniqueId
}) => {

    const dispatch = useAppDispatch();
    const [isActive, setIsActive] = useState<boolean>(false);
    const scheduleStructure = useSelector(getScheduleStructure);

    const textWidth = "150px";
    const switchText = isActive ? "Отключить расписание" : "Включить расписание";
    const opacity = isActive ? 1 : 0.5;

    return (
        <Div
            className={"relative flex"}
        >
            <Div
                className={`relative flex flex-col items-start px-[8px] opacity-[${opacity}]`}
            >
                {
                    isActive ?
                    null : (
                    <Div
                        className={"before:absolute before:z-[1] before:w-[100%] before:h-[100%]"}
                    />
                    )
                }
                <Div className={`flex items-center`}>
                    <Text
                        tag={"p"}
                        className={`${textColor} text-[16px] w-[${textWidth}]`}
                    >
                        Дата начала
                    </Text>
                    <DatePicker
                        className={"ml-[20px] w-[150px] h-[24px]"}
                        onChange={(dayJsData) => {
                            onDatePickerChange({
                                dispatch,
                                itemLimits: {
                                    ...fileItem.limits,
                                    date: {
                                        start: dayJsData !== null ? dayJsData : "default",
                                        end: fileItem.limits.date.end,
                                    }
                                },
                                fileUniqueId,
                                scheduleStructure
                            })
                        }}
                    />
                </Div>
                <Div
                    className={"flex items-center mt-[8px]"}
                >
                    <Text
                        tag={"p"}
                        className={`${textColor} text-[16px] w-[${textWidth}]`}
                    >
                        Дата окончания
                    </Text>
                    <DatePicker
                        className={"ml-[20px] w-[150px] h-[24px]"}
                        onChange={(dayJsData) => {
                            onDatePickerChange({
                                dispatch,
                                fileUniqueId,
                                scheduleStructure,
                                itemLimits: {
                                    ...fileItem.limits,
                                    date: {
                                        start: fileItem.limits.date.start,
                                        end: dayJsData !== null ? dayJsData : null,
                                    }
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
                    className={"flex items-center w-[220px]"}
                >
                    <Input
                        type={"checkbox"}
                        className={"w-[20px] h-[20px] outline-none"}
                        onChange={() => {
                            onToggleValidDaysSwitch({
                                dispatch,
                                isActive,
                                setIsActive,
                                fileUniqueId,
                                scheduleStructure,
                                itemLimits: fileItem.limits,
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

export {DateLimitations};