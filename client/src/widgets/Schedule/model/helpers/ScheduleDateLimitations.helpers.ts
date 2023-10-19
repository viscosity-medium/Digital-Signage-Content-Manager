import {ItemFileLimits, OnPickerChangeProps, ToggleScheduleSwitchProps} from "../Schedule.types";
import {changeItemLimitsRecursively} from "./ScheduleFile.helpers";
import {scheduleActions} from "../Schedule.slice";
import {createNewActiveDirectoryItemsRecursively} from "./ScheduleItemsCreators.helpers";
import {dateWithoutTimezone} from "@/shared";

export const onDatePickerChange = ({
    dispatch,
    itemLimits,
    fileUniqueId,
    scheduleStructure,
    activeDirectoryId
}: OnPickerChangeProps) => {

    const editedItemLimits: ItemFileLimits = {
        ...itemLimits,
        date: {
            start: typeof itemLimits.date.start === "object" && itemLimits.date.start ?
                dateWithoutTimezone(itemLimits.date.start.hour(0).minute(0).second(0).millisecond(0).toDate()) :
                itemLimits.date.start,
            end: typeof itemLimits.date.end === "object" && itemLimits.date.end ?
                dateWithoutTimezone(itemLimits.date.end.hour(0).minute(0).second(0).millisecond(0).toDate()) :
                itemLimits.date.end
        }
    }

    const editedScheduleData = changeItemLimitsRecursively({
        structure: scheduleStructure,
        itemUniqueId: fileUniqueId,
        itemLimits: editedItemLimits
    });


    const updatedActiveItems = createNewActiveDirectoryItemsRecursively(
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

        const editedScheduleData = changeItemLimitsRecursively({
            structure: scheduleStructure,
            itemUniqueId: fileUniqueId,
            itemLimits: {
                ...itemLimits,
                date: {
                    start: "default",
                    end: "default"
                },
                dateIsActive: false
            }
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
                dateIsActive: true
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