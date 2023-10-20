import {AppDispatch} from "@/store/store";
import {Identifier} from "dnd-core";
import {ChangeEvent, Dispatch, MouseEvent, SetStateAction} from "react";
import {scheduleActions} from "../Schedule.slice";
import {
    ItemFileLimits,
    OnPickerChangeProps,
    ScheduleItemInterface,
    ScheduleScrollProperties,
    ToggleScheduleSwitchProps
} from "../Schedule.types";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context";
import {updateScheduleStructure, uploadXmlFilesOnMmsServer} from "../Schedule.asyncThunks";
import {modalActions} from "../../../Modal/model/Modal.slice";
import {
    getChildrenFolderContent,
    getEditedScheduleDataLimits,
    getParentFolderContent,
    getParentFolderId,
    getParentFolderName
} from "./ScheduleItemsGetters.helpers";

import {
    createNewActiveDirectoryItemsRecursively,
    createNewScheduleStructureAfterDeletionRecursively,
    createNewScheduleStructureRecursively
} from "./ScheduleItemsCreators.helpers";
import {renameFolderNameRecursively} from "./ScheduleItemsEditors.helpers";
import {dateWithoutTimezone, stringValidators} from "@/shared";
import {changeItemLimitsRecursively} from "@/widgets/Schedule/model/helpers/ScheduleFile.helpers";
import {
    addNestedScrollProperties,
    removeNestedScrollProperties
} from "@/widgets/Schedule/model/helpers/ScheduleScrollProperties.helpers";

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
export const onOpenFolderSettings = (setIsOpen: Dispatch<SetStateAction<boolean>>) => {
    setIsOpen(prevState => !prevState)
};
export const onChangeIsEditMode = (setIsEditMode: Dispatch<SetStateAction<boolean>>) => {
    setIsEditMode(prevState => !prevState);
};

export const onInputChange = (event: ChangeEvent<HTMLInputElement>, setFolderName: Dispatch<SetStateAction<string>>) => {

    const protectiveCondition = stringValidators.validateInputValue({event});

    if(protectiveCondition) {
        setFolderName(event.target.value);
    }

};

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
export const onCloseCurrentFolderClick = ({
    dispatch,
    scheduleStructure,
    activeDirectoryId,
    router,
    structureParams,
    scrollProperties
}: {
    dispatch: AppDispatch,
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectoryId: string,
    router: AppRouterInstance,
    structureParams: string | null,
    scrollProperties: ScheduleScrollProperties | undefined
}) => {

    const newScrollProperties = removeNestedScrollProperties({scrollProperties});

    const parentFolderItems = getParentFolderContent(scheduleStructure, activeDirectoryId);
    const parentFolderId = getParentFolderId(scheduleStructure, activeDirectoryId);
    const parentFolderName = getParentFolderName(scheduleStructure, activeDirectoryId);

    dispatch(scheduleActions.setActiveDirectoryItems(parentFolderItems));
    dispatch(scheduleActions.setScheduleScrollProperties(newScrollProperties));

    if (parentFolderId && parentFolderName && structureParams) {

        router.push(`/?structure=${structureParams.replace(/\/[^\/]*$/, "")}`);

        dispatch(scheduleActions.setActiveDirectoryId(parentFolderId));
        dispatch(scheduleActions.setActiveDirectoryName(parentFolderName));
        dispatch(scheduleActions.setActiveItem(null));

    }

}
export const onAddNewFolderClick = (
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
export const onFolderElementDoubleClick = ({
    router,
    uniqueId,
    dispatch,
    folderName,
    structureParams,
    scrollProperties,
    scheduleStructure,
}:{
    uniqueId: string,
    folderName: string,
    dispatch: AppDispatch,
    router: AppRouterInstance,
    structureParams: string | null,
    scheduleStructure: Array<ScheduleItemInterface>,
    scrollProperties: ScheduleScrollProperties | undefined,
}) => {

    const newScheduleScrollProperties = addNestedScrollProperties({
        directoryId: uniqueId,
        scrollProperties
    });

    const results = getChildrenFolderContent(scheduleStructure, uniqueId);
    const previousUrl = structureParams !== null ? structureParams : "/rootDirectory";

    router.push(`/?structure=${previousUrl?.replace(/\/$/, "")}/${uniqueId}`)
    dispatch(scheduleActions.setActiveDirectoryId(uniqueId));
    dispatch(scheduleActions.setActiveDirectoryName(folderName));
    dispatch(scheduleActions.setActiveDirectoryItems(results));
    dispatch(scheduleActions.setActiveItem(null));
    dispatch(scheduleActions.setActiveItemIndex(undefined));
    dispatch(scheduleActions.setScheduleScrollProperties(newScheduleScrollProperties));

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

// switch / toggle

export const onToggleValidDays = ({
    dispatch,
    isActive,
    setIsActive,
    fileUniqueId,
    itemLimits,
    scheduleStructure,
    activeDirectoryId
}: ToggleScheduleSwitchProps) => {

    if (isActive) {

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

export const onToggleRandomOrder = ({
    dispatch,
    isActive,
    setIsActive,
    fileUniqueId,
    itemLimits,
    activeDirectoryId,
    scheduleStructure
}: ToggleScheduleSwitchProps) => {

    const editedScheduleData = getEditedScheduleDataLimits({
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