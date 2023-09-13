import {OnPickerChangeProps, ToggleScheduleSwitchProps} from "@/widgets/Schedule/model/Schedule.types";
import {changeFileLimitsRecursively} from "@/widgets/Schedule/model/File.helpers";
import {scheduleActions} from "@/widgets/Schedule/model/Schedule.slice";

export const onTimePickerChange = ({
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

    console.log(editedScheduleData);

}

export const onToggleValidTimeSwitch = ({
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
                time: "default"
            }
        });

        dispatch(scheduleActions.setScheduleStructure(editedScheduleData));

    }

    setIsActive(prevState => !prevState);

};