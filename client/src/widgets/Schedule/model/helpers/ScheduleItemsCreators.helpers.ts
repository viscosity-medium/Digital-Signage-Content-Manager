import {ScheduleFolderInterface, ScheduleItemInterface} from "@/widgets/Schedule/model/Schedule.types";
import {v4 as uuid} from "uuid";

export const createNewScheduleStructureRecursively = (
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: string,
    activeItemIndex: number
): Array<ScheduleItemInterface> => {

    return scheduleStructure.reduce((
        accumulator: Array<ScheduleItemInterface>,
        currentItem: ScheduleItemInterface
    ): Array<ScheduleItemInterface> => {

        if (currentItem.type === "folder") {

            if (currentItem.uniqueId === activeDirectory) {

                const content = currentItem.content.reduce((accum: Array<ScheduleItemInterface>, currentItem: ScheduleItemInterface, index) => {
                    if (activeItemIndex === index) {

                        const newFolderItem: ScheduleFolderInterface = {
                            name: "folder",
                            uniqueId: uuid(),
                            type: "folder",
                            content: [],
                            isEditable: true,
                            limits: {
                                date: {
                                    start: "default",
                                    end: "default"
                                },
                                dateIsActive: false,
                                time: "default",
                                timeIsActive: false,
                                randomIsActive: false
                            }
                        }

                        return ([
                            ...accum,
                            currentItem,
                            newFolderItem
                        ])
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
                        content: content?.length !== 0 ? content : [{
                            type: "folder",
                            name: "folder",
                            uniqueId: uuid(),
                            isEditable: true,
                            content: [],
                            limits: {
                                date: {
                                    start: "default",
                                    end: "default"
                                },
                                dateIsActive: false,
                                time: "default",
                                timeIsActive: false,
                                randomIsActive: false
                            }
                        }]
                    }
                ];
            } else {
                return [
                    ...accumulator,
                    {
                        ...currentItem,
                        content: [
                            ...createNewScheduleStructureRecursively(currentItem.content, activeDirectory, activeItemIndex)
                        ]
                    }
                ];
            }

        } else {
            return [
                ...accumulator,
                currentItem
            ]
        }

    }, [])
}
export const createNewActiveDirectoryItemsRecursively = (
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: string
): Array<ScheduleItemInterface> => {

    return scheduleStructure.reduce((accum: Array<ScheduleItemInterface>, currentItem) => {

        if (currentItem.type === "folder") {
            if (currentItem.uniqueId === activeDirectory) {
                return currentItem.content;
            } else {
                return [
                    ...accum,
                    ...createNewActiveDirectoryItemsRecursively(currentItem.content, activeDirectory)];
            }
        } else {
            return accum;
        }

    }, []);

}
export const createNewScheduleStructureAfterDeletionRecursively = (
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: string,
    deleteIndex: number
): Array<ScheduleItemInterface> => {

    return scheduleStructure.reduce((
        accumulator: Array<ScheduleItemInterface>,
        currentItem: ScheduleItemInterface
    ): Array<ScheduleItemInterface> => {

        if (currentItem.type === "folder") {

            if (currentItem.uniqueId === activeDirectory) {
                return [
                    ...accumulator,
                    {
                        ...currentItem,
                        content: [
                            ...currentItem.content.filter((__, index) => {
                                return deleteIndex !== index
                            }),
                        ]
                    }
                ];
            } else {
                return [
                    ...accumulator,
                    {
                        ...currentItem,
                        content: [
                            ...createNewScheduleStructureAfterDeletionRecursively(currentItem.content, activeDirectory, deleteIndex)
                        ]
                    }
                ];
            }

        } else {
            return [
                ...accumulator,
                currentItem
            ]
        }

    }, [])
}
export const createArrayFromAToB = ({
    firstIndex,
    secondIndex
}: {
    firstIndex: number | undefined,
    secondIndex: number | undefined
}) => {

    if (secondIndex !== undefined) {

        const firstIndexEdited = (firstIndex !== undefined ? firstIndex : 0);
        const bottomBorder = secondIndex - firstIndexEdited > 0 ? firstIndexEdited : secondIndex;
        const topBorder = secondIndex - firstIndexEdited > 0 ? secondIndex : firstIndexEdited;
        const result: number[] = Array(topBorder - bottomBorder + 1);

        for (let i = 0; i < result.length; ++i) {
            result[i] = bottomBorder + i;
        }

        return result;

    } else {
        return []
    }
}