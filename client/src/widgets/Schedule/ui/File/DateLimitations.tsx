import {DatePicker} from "antd";
import {Div, Input, Text} from "@/shared";
import {FC, useState} from "react";
import {onTimePickerChange, toggleValidDaysSwitch} from "@/widgets/Schedule/model/DateLimitations.helpers";

interface DateLimitationsProps{
    textColor: string
}

const DateLimitations: FC<DateLimitationsProps> = ({
    textColor
}) => {

    const [isActive, setIsActive] = useState<boolean>(false);
    const textWidth = "130px";
    const switchText = isActive ? "Отключить расписание" : "Включить расписание";
    const opacity = isActive ? 1 : 0.7;


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
                <Div className={"flex items-center"}>
                    <Text
                        tag={"p"}
                        className={`${textColor} text-[16px] w-[${textWidth}]`}
                    >
                        Дата начала
                    </Text>
                    <DatePicker
                        className={"ml-[20px] w-[150px] h-[24px]"}
                        onChange={(event) => {
                            onTimePickerChange(event)
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
                        onChange={(event) => {
                            onTimePickerChange(event)
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
                        className={"w-[24px] h-[24px] outline-none"}
                        onChange={() => {
                            toggleValidDaysSwitch({
                                setIsActive
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