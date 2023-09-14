import {OnPickerChangeProps, ToggleScheduleSwitchProps} from "@/widgets/Schedule/model/Schedule.types";
import {changeFileLimitsRecursively} from "@/widgets/Schedule/model/File.helpers";
import {scheduleActions} from "@/widgets/Schedule/model/Schedule.slice";
import {createNewActiveDirectoryItems} from "@/widgets/Schedule/model/Schedule.helpers";

export const onDatePickerChange = ({
    dispatch,
    itemLimits,
    fileUniqueId,
    scheduleStructure,
    activeDirectoryId
}: OnPickerChangeProps) => {

    const editedScheduleData = changeFileLimitsRecursively({
        structure: scheduleStructure,
        fileUniqueId,
        itemLimits
    });

    const updatedActiveItems = createNewActiveDirectoryItems(
        editedScheduleData,
        activeDirectoryId
    );

    dispatch(scheduleActions.setScheduleStructure(editedScheduleData));
    dispatch(scheduleActions.setActiveDirectoryItems(updatedActiveItems));

};

export const onToggleValidDaysSwitch = ({
    dispatch,
    isActive,
    setIsActive,
    fileUniqueId,
    itemLimits,
    scheduleStructure,
    activeDirectoryId
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
                },
                dateIsActive: false
            }
        });

        const updatedActiveItems = createNewActiveDirectoryItems(
            editedScheduleData,
            activeDirectoryId
        );

        dispatch(scheduleActions.setScheduleStructure(editedScheduleData));
        dispatch(scheduleActions.setActiveDirectoryItems(updatedActiveItems));

    } else {
        const editedScheduleData = changeFileLimitsRecursively({
            structure: scheduleStructure,
            fileUniqueId,
            itemLimits: {
                ...itemLimits,
                dateIsActive: true
            }
        });

        const updatedActiveItems = createNewActiveDirectoryItems(
            editedScheduleData,
            activeDirectoryId
        );

        dispatch(scheduleActions.setScheduleStructure(editedScheduleData));
        dispatch(scheduleActions.setActiveDirectoryItems(updatedActiveItems));
    }

    setIsActive(prevState => !prevState);

};