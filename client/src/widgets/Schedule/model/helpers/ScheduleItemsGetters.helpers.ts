import {ScheduleItemInterface} from "../Schedule.types";

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

}

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