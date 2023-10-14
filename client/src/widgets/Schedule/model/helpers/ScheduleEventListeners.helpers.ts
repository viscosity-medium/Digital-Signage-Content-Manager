import {AppDispatch} from "@/store/store";
import {Identifier} from "dnd-core";
import {ChangeEvent, Dispatch, MouseEvent, SetStateAction} from "react";
import {scheduleActions} from "@/widgets/Schedule/model/Schedule.slice";
import {ScheduleItemInterface} from "@/widgets/Schedule/model/Schedule.types";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context";
import {updateScheduleStructure, uploadXmlFilesOnMmsServer} from "@/widgets/Schedule/model/Schedule.asyncThunks";
import {modalActions} from "@/widgets/Modal/model/Modal.slice";
import {
    getChildrenFolderContent,
    getParentFolderContent,
    getParentFolderId,
    getParentFolderName
} from "@/widgets/Schedule/model/helpers/ScheduleItemsGetters.helpers";

import {
    createNewActiveDirectoryItemsRecursively,
    createNewScheduleStructureAfterDeletionRecursively, createNewScheduleStructureRecursively
} from "@/widgets/Schedule/model/helpers/ScheduleItemsCreators.helpers";
import {renameFolderNameRecursively} from "@/widgets/Schedule/model/helpers/ScheduleItemsEditors.helpers";
import {stringValidators} from "@/shared";

export const onListElementClick = ({
   dispatch,
   handlerId,
   previousActiveElementIndex,
   activeElementIndex,
   mouseEvent
}: {
    dispatch: AppDispatch,
    handlerId: Identifier | null,
    activeElementIndex: number
    previousActiveElementIndex: number | undefined,
    mouseEvent: MouseEvent<HTMLLIElement>
}) => {

    if (!mouseEvent.shiftKey) {
        dispatch(scheduleActions.setActiveItem(handlerId));
        dispatch(scheduleActions.setActiveItemIndex(activeElementIndex));
        dispatch(scheduleActions.setActiveItemsIndexesRange(undefined));
    }

    if (mouseEvent.shiftKey && activeElementIndex !== undefined) {
        dispatch(scheduleActions.setActiveItemsIndexesRange({
            startIndex: previousActiveElementIndex !== undefined ? previousActiveElementIndex : 0,
            endIndex: activeElementIndex
        }));
        dispatch(scheduleActions.setActiveItemIndex(undefined));
    }

};
export const onOpenExtraSettingsButtonClick = (setIsOpen: Dispatch<SetStateAction<boolean>>) => {
    setIsOpen(prevState => !prevState)
};
export const onChangeIsEditMode = (setIsEditMode: Dispatch<SetStateAction<boolean>>) => {
    setIsEditMode(prevState => !prevState);
}
export const onInputChange = (event: ChangeEvent<HTMLInputElement>, setFolderName: Dispatch<SetStateAction<string>>) => {

    const protectiveCondition = stringValidators.validateInputValue({event});

    if(protectiveCondition) {
        setFolderName(event.target.value);
    }

}
export const onSaveEditedFolderName = (
    dispatch: AppDispatch,
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: string,
    activeItemIndex: number,
    newName: string
) => {

    const newSchedule = renameFolderNameRecursively(scheduleStructure, activeDirectory, activeItemIndex, newName)
    const newActiveDirectoryContent = createNewActiveDirectoryItemsRecursively(newSchedule, activeDirectory)

    dispatch(scheduleActions.setScheduleStructure(newSchedule));
    dispatch(scheduleActions.setActiveDirectoryItems(newActiveDirectoryContent));

}
export const onCloseCurrentFolderClick = (
    dispatch: AppDispatch,
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectoryId: string,
    router: AppRouterInstance,
    structureParams: string | null
) => {

    const parentFolderItems = getParentFolderContent(scheduleStructure, activeDirectoryId);
    const parentFolderId = getParentFolderId(scheduleStructure, activeDirectoryId);
    const parentFolderName = getParentFolderName(scheduleStructure, activeDirectoryId);

    dispatch(scheduleActions.setActiveDirectoryItems(parentFolderItems));

    if (parentFolderId && parentFolderName && structureParams) {

        router.push(`/?structure=${structureParams.replace(/\/[^\/]*$/, "")}`);

        dispatch(scheduleActions.setActiveDirectoryId(parentFolderId));
        dispatch(scheduleActions.setActiveDirectoryName(parentFolderName));
        dispatch(scheduleActions.setActiveItem(null));

    }

}
export const onCreateFolderButtonClick = (
    dispatch: AppDispatch,
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: string,
    activeItemIndex: number
) => {

    const newScheduleStructure = createNewScheduleStructureRecursively(scheduleStructure, activeDirectory, activeItemIndex);
    const newActiveDirectoryItems = createNewActiveDirectoryItemsRecursively(newScheduleStructure, activeDirectory);

    dispatch(scheduleActions.setScheduleStructure(newScheduleStructure));
    dispatch(scheduleActions.setActiveDirectoryItems(newActiveDirectoryItems));

}
export const onFolderElementDoubleClick = (
    dispatch: AppDispatch,
    scheduleStructure: Array<ScheduleItemInterface>,
    uniqueId: string,
    folderName: string,
    router: AppRouterInstance,
    structureParams: string | null
) => {

    const results = getChildrenFolderContent(scheduleStructure, uniqueId);
    const previousUrl = structureParams !== null ? structureParams : "/rootDirectory";

    router.push(`/?structure=${previousUrl?.replace(/\/$/, "")}/${uniqueId}`)
    dispatch(scheduleActions.setActiveDirectoryId(uniqueId));
    dispatch(scheduleActions.setActiveDirectoryName(folderName));
    dispatch(scheduleActions.setActiveDirectoryItems(results));
    dispatch(scheduleActions.setActiveItem(null));
    dispatch(scheduleActions.setActiveItemIndex(undefined));

};
export const onSaveButtonClick = async (dispatch: AppDispatch, scheduleStructure: Array<ScheduleItemInterface>) => {

    const modalContent = await dispatch(updateScheduleStructure({scheduleStructure}))
    .then((serverResponse: any) => {
        return {
            response: serverResponse.payload.response
        }
    })
    .catch(() => {
        return {
            response: "",
            error: "Произошла ошибка: расписание не было сохранено на сервере"
        }
    });

    dispatch(modalActions.setModalIsShown(true));
    dispatch(modalActions.setModalContent(modalContent));

};
export const onDeployButtonClick = async (dispatch: AppDispatch, scheduleStructure: Array<ScheduleItemInterface>) => {
    const modalContent = await dispatch(uploadXmlFilesOnMmsServer({scheduleStructure}))
    .then((serverResponse: any) => {
        return {
            response: serverResponse.payload.response
        }
    })
    .catch(() => {
        return {
            response: "",
            error: "Произошла ошибка: xml-расписание не было загружено на mms-сервер"
        }
    });

    dispatch(modalActions.setModalIsShown(true));
    dispatch(modalActions.setModalContent(modalContent));
}
export const onDeleteButtonClick = (
    dispatch: AppDispatch,
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: string,
    deleteIndex: number
) => {

    const newSchedule = createNewScheduleStructureAfterDeletionRecursively(scheduleStructure, activeDirectory, deleteIndex)
    const newFolderContent = createNewActiveDirectoryItemsRecursively(newSchedule, activeDirectory)

    dispatch(scheduleActions.setScheduleStructure(newSchedule));
    dispatch(scheduleActions.setActiveDirectoryItems(newFolderContent));
    dispatch(scheduleActions.setActiveItemIndex(undefined));
};