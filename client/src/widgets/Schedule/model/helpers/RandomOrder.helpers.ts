import {
    ItemFileLimits, ScheduleItemInterface,
    ToggleScheduleSwitchProps
} from "@/widgets/Schedule/model/Schedule.types";
import {changeItemLimitsRecursively} from "@/widgets/Schedule/model/helpers/File.helpers";
import {scheduleActions} from "@/widgets/Schedule/model/Schedule.slice";


import {createNewActiveDirectoryItemsRecursively} from "@/widgets/Schedule/model/helpers/ScheduleItemsCreators.helpers";

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