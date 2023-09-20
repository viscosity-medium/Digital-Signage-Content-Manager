import {DatePicker} from "antd";
import {Div, Input, Text} from "@/shared";
import {FC, useState} from "react";
import {onDatePickerChange, onToggleValidDaysSwitch} from "@/widgets/Schedule/model/DateLimitations.helpers";
import {LimitationsProps} from "@/widgets/Schedule/model/Schedule.types";
import {useSelector} from "react-redux";
import {getScheduleActiveDirectoryId, getScheduleStructure} from "@/widgets/Schedule/model/Schedule.selectors";
import {useAppDispatch} from "../../../../../store/store";
import dayjs from "dayjs";

const DateLimitations: FC<LimitationsProps> = ({
    fileItem,
    textColor,
    fileUniqueId
}) => {

    const dispatch = useAppDispatch();
    const [isActive, setIsActive] = useState<boolean>(fileItem.limits.dateIsActive);
    const scheduleStructure = useSelector(getScheduleStructure);
    const activeDirectoryId = useSelector(getScheduleActiveDirectoryId);

    const textWidth = "150px";
    const switchText = isActive ? "Отключить расписание" : "Включить расписание";
    const opacity = isActive ? "opacity-[1]" : "opacity-[0.5]";

    const startDate = fileItem?.limits?.date?.start;
    const endDate = fileItem.limits.date.end;

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
                        className={`${textColor} text-[16px] w-[${textWidth}]`}
                    >
                        Дата начала
                    </Text>
                    <DatePicker
                        className={"w-[150px] h-[24px]"}
                        value={ startDate !== "default" ? dayjs(startDate) : null }
                        onChange={(dayJsData) => {
                            onDatePickerChange({
                                dispatch,
                                fileUniqueId,
                                activeDirectoryId,
                                scheduleStructure,
                                itemLimits: {
                                    ...fileItem.limits,
                                    date: {
                                        start: dayJsData !== null ? dayJsData.toISOString() : "default",
                                        end: fileItem.limits.date.end,
                                    }
                                },
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
                        className={"w-[150px] h-[24px]"}
                        value={ endDate !== "default" ? dayjs(endDate) : null }
                        onChange={(dayJsData) => {
                            onDatePickerChange({
                                dispatch,
                                fileUniqueId,
                                activeDirectoryId,
                                scheduleStructure,
                                itemLimits: {
                                    ...fileItem.limits,
                                    date: {
                                        start: fileItem.limits.date.start,
                                        end: dayJsData !== null ? dayJsData.toISOString() : null,
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
                        checked={isActive}
                        onChange={() => {
                            onToggleValidDaysSwitch({
                                dispatch,
                                isActive,
                                setIsActive,
                                fileUniqueId,
                                activeDirectoryId,
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