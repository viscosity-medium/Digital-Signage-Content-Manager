import {OnPickerChangeProps, ToggleScheduleSwitchProps} from "@/widgets/Schedule/model/Schedule.types";
import {changeFileLimitsRecursively} from "@/widgets/Schedule/model/File.helpers";
import {scheduleActions} from "@/widgets/Schedule/model/Schedule.slice";

export const onDatePickerChange = ({
    dispatch,
    itemLimits,
    fileUniqueId,
    scheduleStructure
}: OnPickerChangeProps) => {

    const editedScheduleData = changeFileLimitsRecursively({
        structure: scheduleStructure,
        fileUniqueId,
        itemLimits
    });

    dispatch(scheduleActions.setScheduleStructure(editedScheduleData));

}

export const onToggleValidDaysSwitch = ({
    dispatch,
    isActive,
    setIsActive,
    fileUniqueId,
    itemLimits,
    scheduleStructure
}: ToggleScheduleSwitchProps) => {

    if(isActive){

        const editedScheduleData = changeFileLimitsRecursively({
            structure: scheduleStructure,
            fileUniqueId,
            itemLimits: {
                ...itemLimits,
                date: {
                    start: "default",
                    end: "default"
                }
            }
        });

        dispatch(scheduleActions.setScheduleStructure(editedScheduleData));

    }

    setIsActive(prevState => !prevState);

};