import {TimePicker} from "antd";
import {Div, Input, Text} from "@/shared";
import {FC, useState} from "react";
import {LimitationsProps} from "@/widgets/Schedule/model/Schedule.types";
import {useSelector} from "react-redux";
import {getScheduleStructure} from "@/widgets/Schedule/model/Schedule.selectors";
import {onTimePickerChange, onToggleValidTimeSwitch} from "@/widgets/Schedule/model/TimeLimitations.helpers";
import {useAppDispatch} from "../../../../../store/store";

const TimeLimitations: FC<LimitationsProps> = ({
    fileItem,
    textColor,
    fileUniqueId
}) => {

    const dispatch = useAppDispatch();
    const [isActive, setIsActive] = useState<boolean>(false);
    const scheduleStructure = useSelector(getScheduleStructure);

    const textWidth = "150px";
    const switchText = isActive ? "Не указывать время" : "Указать время";
    const opacity = isActive ? 1 : 0.5;

    return (
        <Div
            className={"relative flex items-center mt-[8px]"}
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
                <Div className={"flex items-center"}>
                    <Text
                        tag={"p"}
                        className={`${textColor} text-[16px] w-[${textWidth}]`}
                    >
                        Длительность
                    </Text>
                    <TimePicker
                        className={"ml-[20px] w-[150px] h-[24px]"}
                        format={"mm:ss"}
                        onChange={(dayJsData) => {
                            onTimePickerChange({
                                dispatch,
                                itemLimits: {
                                    ...fileItem.limits,
                                    time: "default"
                                },
                                fileUniqueId,
                                scheduleStructure
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
                        className={"w-[20px] h-[20px] outline-none"}
                        onChange={() => {
                            onToggleValidTimeSwitch({
                                dispatch,
                                isActive,
                                fileUniqueId,
                                setIsActive,
                                scheduleStructure,
                                itemLimits: fileItem.limits
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

export {TimeLimitations};