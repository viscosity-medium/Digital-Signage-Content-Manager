import {DatePicker} from "antd";
import {Div, Input, Text} from "@/shared";
import {FC, useState} from "react";
import {onDatePickerChange, onToggleValidDaysSwitch} from "../../model/helpers/ScheduleDateLimitations.helpers";
import {LimitationsProps} from "../../model/Schedule.types";
import {useSelector} from "react-redux";
import {getScheduleActiveDirectoryId, getScheduleStructure} from "../../model/Schedule.selectors";
import {useAppDispatch} from "@/store/store";
import dayjs from "dayjs";

const DateLimitations: FC<LimitationsProps> = ({
    item,
    textColor,
    fileUniqueId
}) => {

    const dispatch = useAppDispatch();
    const [isActive, setIsActive] = useState<boolean>(item.limits.dateIsActive);
    const scheduleStructure = useSelector(getScheduleStructure);
    const activeDirectoryId = useSelector(getScheduleActiveDirectoryId);

    const textWidth = "150px";
    const switchText = isActive ? "Отключить расписание" : "Включить расписание";
    const opacity = isActive ? "opacity-[1]" : "opacity-[0.5]";

    const startDate = item?.limits?.date?.start;
    const endDate = item.limits.date.end;

    return (
        <Div
            className={"relative flex"}
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
                <Div className={`flex items-center`}>
                    <Text
                        tag={"p"}
                        className={`${textColor} text-[14px] w-[${textWidth}]`}
                    >
                        Дата начала
                    </Text>
                    <DatePicker
                        className={"w-[150px] h-[20px]"}
                        value={ startDate !== "default" ? dayjs(startDate) : null }
                        onChange={(dayJsData) => {
                            onDatePickerChange({
                                dispatch,
                                fileUniqueId,
                                activeDirectoryId,
                                scheduleStructure,
                                itemLimits: {
                                    ...item.limits,
                                    date: {
                                        start: dayJsData !== null ? dayJsData : "default",
                                        end: item.limits.date.end,
                                    }
                                },
                            })
                        }}
                    />
                </Div>
                <Div
                    className={"flex items-center mt-[4px]"}
                >
                    <Text
                        tag={"p"}
                        className={`${textColor} text-[14px] w-[${textWidth}]`}
                    >
                        Дата окончания
                    </Text>
                    <DatePicker
                        className={"w-[150px] h-[20px] f-[14px]"}
                        value={ endDate !== "default" ? dayjs(endDate) : null }
                        onChange={(dayJsData) => {
                            onDatePickerChange({
                                dispatch,
                                fileUniqueId,
                                activeDirectoryId,
                                scheduleStructure,
                                itemLimits: {
                                    ...item.limits,
                                    date: {
                                        start: item.limits.date.start,
                                        end: dayJsData !== null ? dayJsData : "default",
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
                        className={"w-[18px] h-[18px] outline-none"}
                        checked={isActive}
                        onChange={() => {
                            onToggleValidDaysSwitch({
                                dispatch,
                                isActive,
                                setIsActive,
                                fileUniqueId,
                                activeDirectoryId,
                                scheduleStructure,
                                itemLimits: item.limits,
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

export {DateLimitations};