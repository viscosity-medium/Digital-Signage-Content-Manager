import {ScheduleItemInterface} from "../Schedule.types";

export const renameFolderNameRecursively = (
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: string,
    activeItemIndex: number,
    newName: string
): Array<ScheduleItemInterface> => {

    return scheduleStructure.reduce((accumulator: Array<ScheduleItemInterface>, currentItem) => {

        if (currentItem.type === "folder") {
            if (currentItem.uniqueId === activeDirectory) {
                return [
                    ...accumulator,
                    {
                        ...currentItem,
                        content: currentItem.content.reduce((accum: Array<ScheduleItemInterface>, currentInnerItem, index) => {
                            if (activeItemIndex === index) {
                                return ([
                                        ...accum,
                                        {
                                            ...currentInnerItem,
                                            name: newName
                                        },

                                    ]

                                )
                            } else {
                                return [
                                    ...accum,
                                    currentInnerItem
                                ]
                            }

                        }, []),
                    }
                ];
            } else {
                
                return [
                    ...accumulator,
                    {
                        ...currentItem,
                        content: [
                            ...renameFolderNameRecursively(currentItem.content, activeDirectory, activeItemIndex, newName)
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