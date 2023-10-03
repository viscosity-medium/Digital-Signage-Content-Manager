import {KeyboardEvent} from "react"
import {AppDispatch} from "@/store/store";
import {ActiveItemsIndexesRange, ScheduleItemInterface} from "@/widgets/Schedule/model/Schedule.types";
import {
    copyScheduleElementToBuffer,
    pasteCopiedElementsFromBufferToSchedule
} from "@/widgets/Schedule/model/helpers/ScheduleCopyPaste.helpers";

export interface OnBodyKeyDownProps {
    event:  KeyboardEvent<HTMLBodyElement>
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

    if(event.ctrlKey && event.code === "KeyC"){
        copyScheduleElementToBuffer({
            dispatch,
            activeItemIndex,
            activeItemsIndexesRange,
            activeDirectoryScheduleItems
        })
    }

    if(event.ctrlKey && event.code === "KeyV"){
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