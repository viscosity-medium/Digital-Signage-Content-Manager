import {
    ItemFileLimits, ScheduleItemInterface,
    ToggleScheduleSwitchProps
} from "../Schedule.types";
import {changeItemLimitsRecursively} from "./File.helpers";
import {scheduleActions} from "../Schedule.slice";
import {createNewActiveDirectoryItemsRecursively} from "./ScheduleItemsCreators.helpers";

const getEditedScheduleData = ({
    scheduleStructure,
    fileUniqueId,
    itemLimits,
    isActive
}: {
    scheduleStructure: Array<ScheduleItemInterface>,
    fileUniqueId: string,
    itemLimits: ItemFileLimits,
    isActive: boolean
}) => {
    if(isActive){

        return  changeItemLimitsRecursively({
            structure: scheduleStructure,
            itemUniqueId: fileUniqueId,
            itemLimits: {
                ...itemLimits,
                randomIsActive: false
            },
        });

    } else {

        return changeItemLimitsRecursively({
            structure: scheduleStructure,
            itemUniqueId: fileUniqueId,
            itemLimits: {
                ...itemLimits,
                randomIsActive: true
            }
        });

    }
}

export const onToggleRandomOrderSwitch = ({
    dispatch,
    isActive,
    setIsActive,
    fileUniqueId,
    itemLimits,
    activeDirectoryId,
    scheduleStructure
}: ToggleScheduleSwitchProps) => {

    const editedScheduleData = getEditedScheduleData({
        scheduleStructure, fileUniqueId,
        itemLimits, isActive
    });

    const updatedActiveItems = createNewActiveDirectoryItemsRecursively(
        editedScheduleData,
        activeDirectoryId
    );

    dispatch(scheduleActions.setScheduleStructure(editedScheduleData));
    dispatch(scheduleActions.setActiveDirectoryItems(updatedActiveItems));

    setIsActive(prevState => !prevState);

};