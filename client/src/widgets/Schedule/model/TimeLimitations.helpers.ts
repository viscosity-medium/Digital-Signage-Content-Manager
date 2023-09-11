import {ToggleScheduleSwitchProps} from "@/widgets/Schedule/model/Schedule.types";
import {Dayjs} from "dayjs";

export const datePickerDataConverter = () => {

}

export const toggleScheduleSwitch = ({setIsActive}: ToggleScheduleSwitchProps) => {
    setIsActive(prevState => !prevState);
};

export const onDatePickerChange = (event: Dayjs | null) => {
    console.log(event);
}