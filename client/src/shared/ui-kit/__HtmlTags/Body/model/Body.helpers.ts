import {KeyboardEvent} from "react"
import {AppDispatch} from "@/store/store";
import {ActiveItemsIndexesRange, ScheduleItemInterface} from "@/widgets/Schedule/model/Schedule.types";
import {
    copyScheduleElementToBuffer,
    pasteCopiedElementsFromBufferToSchedule
} from "@/widgets/Schedule/model/helpers/ScheduleCopyPaste.helpers";

export interface OnBodyKeyDownProps {
    event: KeyboardEvent<HTMLBodyElement>
    dispatch: AppDispatch,
    activeDirectoryId: string
    activeItemIndex: number | undefined
    scheduleStructure: Array<ScheduleItemInterface>
    activeDirectoryScheduleItems: Array<ScheduleItemInterface>
    activeItemsIndexesRange: ActiveItemsIndexesRange | undefined,
    scheduleBufferDataToCopy: Array<ScheduleItemInterface>
}

export const onBodyKeyDown = ({
    event,
    dispatch,
    activeItemIndex,
    activeDirectoryId,
    scheduleStructure,
    activeItemsIndexesRange,
    activeDirectoryScheduleItems,
    scheduleBufferDataToCopy
}: OnBodyKeyDownProps) => {

    const htmlElement = event.target as HTMLElement

    if(event.ctrlKey && event.code === "KeyC" && htmlElement.tagName.toUpperCase() !== "INPUT"){
        copyScheduleElementToBuffer({
            dispatch,
            activeItemIndex,
            activeItemsIndexesRange,
            activeDirectoryScheduleItems
        })
    }

    if(event.ctrlKey && event.code === "KeyV" && htmlElement.tagName.toUpperCase() !== "INPUT"){
        pasteCopiedElementsFromBufferToSchedule({
            dispatch,
            activeItemIndex,
            activeDirectoryId,
            scheduleStructure,
            activeItemsIndexesRange,
            scheduleBufferDataToCopy
        })
    }

}