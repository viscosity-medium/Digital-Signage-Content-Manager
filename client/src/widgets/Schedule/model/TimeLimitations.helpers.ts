import {OnPickerChangeProps, ToggleScheduleSwitchProps} from "@/widgets/Schedule/model/Schedule.types";
import {changeItemLimitsRecursively} from "@/widgets/Schedule/model/File.helpers";
import {scheduleActions} from "@/widgets/Schedule/model/Schedule.slice";
import {createNewActiveDirectoryItems} from "@/widgets/Schedule/model/Schedule.helpers";

export const onTimePickerChange = ({
    dispatch,
    itemLimits,
    fileUniqueId,
    activeDirectoryId,
    scheduleStructure,
}: OnPickerChangeProps) => {

    const editedScheduleData = changeItemLimitsRecursively({
        structure: scheduleStructure,
        itemUniqueId: fileUniqueId,
        itemLimits
    });

    const updatedActiveItems = createNewActiveDirectoryItems(
        editedScheduleData,
        activeDirectoryId
    );

    dispatch(scheduleActions.setScheduleStructure(editedScheduleData));
    dispatch(scheduleActions.setActiveDirectoryItems(updatedActiveItems));

};

export const onToggleValidTimeSwitch = ({
    dispatch,
    isActive,
    setIsActive,
    fileUniqueId,
    itemLimits,
    activeDirectoryId,
    scheduleStructure
}: ToggleScheduleSwitchProps) => {

    if(isActive){

        const editedScheduleData = changeItemLimitsRecursively({
            structure: scheduleStructure,
            itemUniqueId: fileUniqueId,
            itemLimits: {
                ...itemLimits,
                time: "default",
                timeIsActive: false
            },
        });

        const updatedActiveItems = createNewActiveDirectoryItems(
            editedScheduleData,
            activeDirectoryId
        );

        dispatch(scheduleActions.setScheduleStructure(editedScheduleData));
        dispatch(scheduleActions.setActiveDirectoryItems(updatedActiveItems));

    } else {
        const editedScheduleData = changeItemLimitsRecursively({
            structure: scheduleStructure,
            itemUniqueId: fileUniqueId,
            itemLimits: {
                ...itemLimits,
                timeIsActive: true
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