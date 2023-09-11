import {ToggleScheduleSwitchProps} from "@/widgets/Schedule/model/Schedule.types";
import {Dayjs} from "dayjs";

export const datePickerDataConverter = () => {

}

export const toggleValidDaysSwitch = ({setIsActive}: ToggleScheduleSwitchProps) => {
    setIsActive(prevState => !prevState);
};

export const onTimePickerChange = (event: Dayjs | null) => {
    console.log(event);
}