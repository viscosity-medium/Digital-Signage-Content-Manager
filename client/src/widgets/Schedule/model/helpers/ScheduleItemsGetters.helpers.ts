import {ItemFileLimits, ScheduleItemInterface} from "../Schedule.types";
import {Identifier} from "dnd-core";
import {changeItemLimitsRecursively} from "@/widgets/Schedule/model/helpers/ScheduleFile.helpers";

export const getChildrenFolderContent = (
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: "rootDirectory" | string
): Array<ScheduleItemInterface> => {

    return scheduleStructure.reduce((accumulator: Array<ScheduleItemInterface>, currentItem) => {

        if (currentItem.type === "folder") {
            if (currentItem.uniqueId === activeDirectory) {
                return currentItem["content"];
            } else {
                return [
                    ...accumulator,
                    ...getChildrenFolderContent(currentItem["content"], activeDirectory)];
            }
        } else {
            return accumulator
        }

    }, []);

};

export const getChildrenFolderName = (
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: "rootDirectory" | string
): string => {

    return scheduleStructure.reduce((accumulator: string, currentItem) => {

        if (currentItem.type === "folder") {
            if (currentItem.uniqueId === activeDirectory) {
                return currentItem.name;
            } else {
                return accumulator + getChildrenFolderName(currentItem["content"], activeDirectory);
            }
        } else {
            return accumulator
        }

    }, "");

}

export const getParentFolderContent = (
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: "rootDirectory" | string,
): Array<ScheduleItemInterface> => {

    return scheduleStructure.reduce((accumulator: Array<ScheduleItemInterface>, currentItem) => {

        if (currentItem.type === "folder") {
            if (currentItem.uniqueId === activeDirectory) {
                return scheduleStructure;
            } else {
                return [
                    ...accumulator,
                    ...getParentFolderContent(currentItem["content"], activeDirectory)];
            }
        } else {
            return accumulator;
        }

    }, []);

}

export const getParentFolderId = (
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: "rootDirectory" | string,
    parentFolderId?: string
): string | undefined => {

    return scheduleStructure.reduce((accumulator: string | undefined, currentItem) => {

        if (currentItem.type === "folder") {
            const folderId = currentItem.uniqueId;
            if (currentItem.uniqueId === activeDirectory) {
                return parentFolderId;
            } else {
                return accumulator || getParentFolderId(currentItem["content"], activeDirectory, folderId);
            }
        } else {
            return accumulator;
        }

    }, undefined);

}
export const getParentFolderName = (
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: "rootDirectory" | string,
    parentFolderName?: string
): string | undefined => {

    return scheduleStructure.reduce((accumulator: string | undefined, currentItem) => {

        if (currentItem.type === "folder") {

            const folderName = currentItem.name;

            if (currentItem.uniqueId === activeDirectory) {
                return parentFolderName;
            } else {
                return accumulator || getParentFolderName(currentItem["content"], activeDirectory, folderName);
            }

        } else {
            return accumulator;
        }

    }, undefined);

}

export const getItemIsActiveCondition = ({
    index,
    handlerId,
    indexesRange,
    activeItemIndex,
    scheduleActiveItem
}: {
    index: number,
    handlerId: Identifier | null,
    indexesRange: number[],
    activeItemIndex: number | undefined,
    scheduleActiveItem: Identifier | null,
}) => {
    return (activeItemIndex !== undefined && handlerId === scheduleActiveItem) || indexesRange.includes(index);
}
export const getFoldersElementsColors = ({condition}: { condition: boolean }) => {
    const folderBackgroundColor = condition ? "activeBackgroundColor" : "folderBackgroundColor";
    const folderBorderColor = condition ? "activeBorderColor" : "folderBorderColor";
    const textColor = condition ? "whiteTextColor" : "blueTextColor";

    return {
        textColor,
        folderBorderColor,
        folderBackgroundColor
    }
};
export const getFileElementsColors = ({condition}: { condition: boolean }) => {
    const fileBackgroundColor = condition ? "activeBackgroundColor" : "whiteBackgroundColor";
    const fileColorLight = condition ? "activeBorderColor" : "whiteBorderColor";
    const textColor = condition ? "whiteTextColor" : "blueTextColor";

    return {
        textColor,
        fileColorLight,
        fileBackgroundColor
    }
}
export const getEditedScheduleDataLimits = ({
    scheduleStructure,
    fileUniqueId,
    itemLimits,
    isActive
}: {
    scheduleStructure: Array<ScheduleItemInterface>,
    fileUniqueId: string,
    itemLimits: ItemFileLimits,
    isActive: boolean
}) => {
    if (isActive) {

        return changeItemLimitsRecursively({
            structure: scheduleStructure,
            itemUniqueId: fileUniqueId,
            itemLimits: {
                ...itemLimits,
                randomIsActive: false
            },
        });

    } else {

        return changeItemLimitsRecursively({
            structure: scheduleStructure,
            itemUniqueId: fileUniqueId,
            itemLimits: {
                ...itemLimits,
                randomIsActive: true
            }
        });

    }
}