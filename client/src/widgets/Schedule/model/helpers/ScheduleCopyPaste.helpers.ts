import {AppDispatch} from "@/store/store";
import {ActiveItemsIndexesRange, ScheduleItemInterface} from "@/widgets/Schedule/model/Schedule.types";
import {scheduleActions} from "@/widgets/Schedule/model/Schedule.slice";
import {v4 as uuid} from "uuid";

import {createNewActiveDirectoryItemsRecursively} from "@/widgets/Schedule/model/helpers/ScheduleItemsCreators.helpers";

export const copyScheduleElementToBuffer = ({
    dispatch,
    activeItemIndex,
    activeItemsIndexesRange,
    activeDirectoryScheduleItems
}: {
    dispatch: AppDispatch,
    activeItemIndex: number | undefined
    activeDirectoryScheduleItems: Array<ScheduleItemInterface>
    activeItemsIndexesRange: ActiveItemsIndexesRange | undefined
}) => {

    if (activeItemsIndexesRange) {

        const {startIndex, endIndex} = activeItemsIndexesRange;
        const copiedItems = activeDirectoryScheduleItems.slice(startIndex, endIndex + 1);

        dispatch(scheduleActions.setCopyBuffer(copiedItems));

    } else if (activeItemIndex !== undefined) {

        const copiedItems = activeDirectoryScheduleItems.slice(activeItemIndex, activeItemIndex + 1);

        dispatch(scheduleActions.setCopyBuffer(copiedItems));

    }

}
const pasteMultipleElementsRecursively = ({
    scheduleStructure,
    activeDirectoryId,
    copyAfterIndex,
    scheduleBufferDataToCopy
}: {
    copyAfterIndex: number
    activeDirectoryId: string
    scheduleStructure: Array<ScheduleItemInterface>
    scheduleBufferDataToCopy: Array<ScheduleItemInterface>,
}): Array<ScheduleItemInterface> => {
    return scheduleStructure.reduce((accumulator: Array<ScheduleItemInterface>, currentItem: ScheduleItemInterface) => {

        if (currentItem.type === "folder") {

            if (currentItem.uniqueId === activeDirectoryId) {

                const returnBufferDataWithNewIds = () => [
                    ...scheduleBufferDataToCopy.reduce((
                        bufferAccumulator: Array<ScheduleItemInterface>,
                        currentBufferItem: ScheduleItemInterface
                    ) => {
                        return [
                            ...bufferAccumulator,
                            {
                                ...currentBufferItem,
                                id: uuid(),
                                uniqueId: uuid(),
                            }
                        ]
                    }, [])
                ];

                const content = currentItem.content.reduce((accum: Array<ScheduleItemInterface>, currentItem: ScheduleItemInterface, index) => {
                    if (copyAfterIndex === index) {
                        if (index !== 0) {
                            return ([
                                ...accum,
                                currentItem,
                                ...returnBufferDataWithNewIds()
                            ])
                        } else {
                            return ([
                                ...accum,
                                ...returnBufferDataWithNewIds(),
                                currentItem,
                            ])
                        }
                    } else {
                        return [
                            ...accum,
                            currentItem
                        ]
                    }

                }, [])

                return [
                    ...accumulator,
                    {
                        ...currentItem,
                        content: content.length !== 0 ? content : returnBufferDataWithNewIds()
                    }
                ];

            } else {
                return [
                    ...accumulator,
                    {
                        ...currentItem,
                        content: pasteMultipleElementsRecursively({
                            scheduleStructure: currentItem.content,
                            copyAfterIndex,
                            activeDirectoryId,
                            scheduleBufferDataToCopy
                        })
                    }
                ]
            }

        } else if (currentItem.type === "file") {

            return [
                ...accumulator,
                currentItem
            ]

        }

        return accumulator
    }, [])
}
export const pasteCopiedElementsFromBufferToSchedule = ({
    dispatch,
    activeItemIndex,
    activeDirectoryId,
    scheduleStructure,
    scheduleBufferDataToCopy,
    activeItemsIndexesRange
}: {
    dispatch: AppDispatch,
    activeDirectoryId: string
    activeItemIndex: number | undefined
    scheduleStructure: Array<ScheduleItemInterface>
    scheduleBufferDataToCopy: Array<ScheduleItemInterface>,
    activeItemsIndexesRange: ActiveItemsIndexesRange | undefined
}) => {
    if (scheduleBufferDataToCopy.length !== 0 && activeItemsIndexesRange === undefined) {

        const copyAfterIndex = activeItemIndex !== undefined ? activeItemIndex : 0;
        const newSchedule = pasteMultipleElementsRecursively({
            copyAfterIndex,
            scheduleStructure,
            activeDirectoryId,
            scheduleBufferDataToCopy
        });
        const newActiveDirectoryContent = createNewActiveDirectoryItemsRecursively(newSchedule, activeDirectoryId);

        dispatch(scheduleActions.setScheduleStructure(newSchedule));
        dispatch(scheduleActions.setActiveDirectoryItems(newActiveDirectoryContent));

    }
};