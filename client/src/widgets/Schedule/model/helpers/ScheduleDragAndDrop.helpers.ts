import {AppDispatch} from "@/store/store";
import {ScheduleItemInterface} from "@/widgets/Schedule/model/Schedule.types";
import update from "immutability-helper";
import {scheduleActions} from "@/widgets/Schedule/model/Schedule.slice";

export const moveScheduleItem = (
    dispatch: AppDispatch,
    directoryItems: Array<ScheduleItemInterface>,
    activeDirectoryItems: Array<ScheduleItemInterface>,
    activeDirectory: string
) => (dragIndex: number, hoverIndex: number) => {

    const newActiveItems = update(activeDirectoryItems, {
        $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, activeDirectoryItems[dragIndex]],
        ],
    });

    const editInternalItemsRecursively = (
        directoryItems: Array<ScheduleItemInterface>,
        newActiveItems: Array<ScheduleItemInterface>,
        activeDirectory: string
    ): Array<ScheduleItemInterface> => {

        return directoryItems.reduce((
            accumulator: Array<ScheduleItemInterface>,
            currentItem
        ) => {

            if (currentItem.type === "folder") {

                if (currentItem.uniqueId === activeDirectory) {
                    return (
                        [
                            ...accumulator,
                            {
                                ...currentItem,
                                content: newActiveItems
                            }
                        ]
                    )
                } else {
                    return (
                        [
                            ...accumulator,
                            {
                                ...currentItem,
                                content: editInternalItemsRecursively(currentItem.content, newActiveItems, activeDirectory)
                            }
                        ]
                    )
                }
            } else {
                return ([
                    ...accumulator,
                    {
                        ...currentItem,
                    }
                ])
            }
        }, [])
    };

    const newStructure = editInternalItemsRecursively(directoryItems, newActiveItems, activeDirectory);
    dispatch(scheduleActions.setActiveItemIndex(hoverIndex))
    dispatch(scheduleActions.setScheduleStructure(newStructure));
    dispatch(scheduleActions.setActiveDirectoryItems((
        newActiveItems
    )));

};