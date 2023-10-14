import {AppDispatch} from "@/store/store";
import {ActiveItemsIndexesRange, ScheduleItemInterface} from "@/widgets/Schedule/model/Schedule.types";
import {scheduleActions} from "@/widgets/Schedule/model/Schedule.slice";
import {v4 as uuid} from "uuid";

import {createNewActiveDirectoryItemsRecursively} from "@/widgets/Schedule/model/helpers/ScheduleItemsCreators.helpers";

export const changeInternalItemsId = ({
    scheduleInternalStructure
}: {
    scheduleInternalStructure: Array<ScheduleItemInterface>
}): Array<ScheduleItemInterface> => {

    return scheduleInternalStructure.map((internalItem: ScheduleItemInterface) => {
        if(internalItem.type === "folder") {
            return {
                ...internalItem,
                uniqueId: uuid(),
                content: changeInternalItemsId({scheduleInternalStructure: internalItem.content})
            }
        } else if(internalItem.type === "file") {
            return {
                ...internalItem,
                uniqueId: uuid()
            }
        } else {
            return internalItem
        }
    });
}

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
    copyAfterIndex: number | undefined
    activeDirectoryId: string
    scheduleStructure: Array<ScheduleItemInterface>
    scheduleBufferDataToCopy: Array<ScheduleItemInterface>,
}): Array<ScheduleItemInterface> => {
    return scheduleStructure.reduce((accumulator: Array<ScheduleItemInterface>, currentParentItem: ScheduleItemInterface) => {

        if (currentParentItem.type === "folder") {

            if (currentParentItem.uniqueId === activeDirectoryId) {

                const returnBufferDataWithNewIds = () => [
                    ...scheduleBufferDataToCopy.reduce((
                        bufferAccumulator: Array<ScheduleItemInterface>,
                        currentBufferItem: ScheduleItemInterface
                    ) => {

                        if(currentBufferItem.type === "folder"){
                            return [
                                ...bufferAccumulator,
                                {
                                    ...currentBufferItem,
                                    id: uuid(),
                                    uniqueId: uuid(),
                                    content: changeInternalItemsId({scheduleInternalStructure: currentBufferItem.content})
                                }
                            ]
                        } else {
                            return [
                                ...bufferAccumulator,
                                {
                                    ...currentBufferItem,
                                    id: uuid(),
                                    uniqueId: uuid(),
                                }
                            ]
                        }

                    }, [])
                ];

                const nonUndefinedCopyAfterIndex = copyAfterIndex !== undefined ? copyAfterIndex :
                    currentParentItem.content.length > 0 ? currentParentItem.content.length - 1 : 0;

                const content = currentParentItem.content.reduce((accum: Array<ScheduleItemInterface>, currentChildItem: ScheduleItemInterface, index) => {

                    if (nonUndefinedCopyAfterIndex === index) {
                        if (currentParentItem.content.length > 0) {
                            return ([
                                ...accum,
                                currentChildItem,
                                ...returnBufferDataWithNewIds()
                            ])
                        } else {
                            return ([
                                ...accum,
                                ...returnBufferDataWithNewIds(),
                                currentChildItem,
                            ])
                        }
                    } else {
                        return [
                            ...accum,
                            currentChildItem
                        ]
                    }

                }, []);

                return [
                    ...accumulator,
                    {
                        ...currentParentItem,
                        content: content.length !== 0 ? content : returnBufferDataWithNewIds()
                    }
                ];

            } else {
                return [
                    ...accumulator,
                    {
                        ...currentParentItem,
                        content: pasteMultipleElementsRecursively({
                            scheduleStructure: currentParentItem.content,
                            copyAfterIndex,
                            activeDirectoryId,
                            scheduleBufferDataToCopy
                        })
                    }
                ]
            }

        } else if (currentParentItem.type === "file") {

            return [
                ...accumulator,
                currentParentItem
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

        const copyAfterIndex = activeItemIndex;
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