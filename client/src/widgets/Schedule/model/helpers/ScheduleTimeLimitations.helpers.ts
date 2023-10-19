import {OnPickerChangeProps, ToggleScheduleSwitchProps} from "../Schedule.types";
import {scheduleActions} from "../Schedule.slice";
import {changeItemLimitsRecursively} from "./ScheduleFile.helpers";
import {createNewActiveDirectoryItemsRecursively} from "./ScheduleItemsCreators.helpers";

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

    const updatedActiveItems = createNewActiveDirectoryItemsRecursively(
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

        const updatedActiveItems = createNewActiveDirectoryItemsRecursively(
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

        const updatedActiveItems = createNewActiveDirectoryItemsRecursively(
            editedScheduleData,
            activeDirectoryId
        );

        dispatch(scheduleActions.setScheduleStructure(editedScheduleData));
        dispatch(scheduleActions.setActiveDirectoryItems(updatedActiveItems));
    }

    setIsActive(prevState => !prevState);

};